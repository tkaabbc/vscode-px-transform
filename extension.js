const vscode = require('vscode');
const { COMMAND_KEYS, CONFIGURATION_PREFIX, NUM_REGEXP, MESSAGES } = require('./constant');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const disposableForTransform = vscode.commands.registerTextEditorCommand(COMMAND_KEYS.TRANSFORM, function (textEditor, textEditorEdit) {
    const {
      multiplier,
      targetUnit,
      sourceUnit,
      unitPrecision,
    } = getTransformConfiguration();
    const regexStr = `${NUM_REGEXP}${sourceUnit}`;
    placeholder(regexStr, (match, value) => `${pxTransform(value, multiplier, unitPrecision)}${targetUnit}`, textEditor, textEditorEdit);
  });
  const disposableForInverseTransform = vscode.commands.registerTextEditorCommand(COMMAND_KEYS.INVERSE_TRANSFORM, function (textEditor, textEditorEdit) {
    const {
      multiplier,
      targetUnit,
      sourceUnit,
      unitPrecision,
    } = getTransformConfiguration();
    const regexStr = `${NUM_REGEXP}${targetUnit}`;
    placeholder(regexStr, (match, value) => `${pxInverseTransform(value, multiplier, unitPrecision)}${sourceUnit}`, textEditor, textEditorEdit);
  });

  context.subscriptions.push(disposableForTransform);
  context.subscriptions.push(disposableForInverseTransform);
}

function pxTransform(value, multiplier, unitPrecision) {
  if (multiplier == 0) { return 0; }
  return parseFloat((value * multiplier).toFixed(unitPrecision));
}

const pxInverseTransform = (value, multiplier, unitPrecision) => {
  if (multiplier == 0) {
    return vscode.window.showErrorMessage(MESSAGES.INVERSE_TRANSFORM_FAIL);
  }
  return parseFloat((value / multiplier).toFixed(unitPrecision));
}

const getTransformConfiguration = () => {
  const config = vscode.workspace.getConfiguration(CONFIGURATION_PREFIX);
  return {
    multiplier: config.get('multiplier'),
    targetUnit: config.get('targetUnit'),
    sourceUnit: config.get('sourceUnit'),
    unitPrecision: config.get('unitPrecision'),
  }
}

function placeholder(regexString, replaceFunction, textEditor, textEditorEdit) {
  const regexExpG = new RegExp(regexString, "ig");
  const selections = textEditor.selections;
  if (selections.length == 0 || selections.reduce((acc, val) => acc || val.isEmpty), false) { return; }
  const changesMade = new Map();
  textEditor.edit(builder => {
    let numOcurrences = 0;
    selections.forEach((selection) => {
      for (let index = selection.start.line; index <= selection.end.line; index++) {
        let start = 0, end = textEditor.document.lineAt(index).range.end.character;
        if (index === selection.start.line) {
          let tmpSelection = selection.with({ end: selection.start });
          let range = findValueRangeToConvert(tmpSelection, regexString, textEditor);
          if (range) {
            start = range.start.character;
          } else {
            start = selection.start.character;
          }
        }
        if (index === selection.end.line) {
          let tmpSelection = selection.with({ start: selection.end });
          let range = findValueRangeToConvert(tmpSelection, regexString, textEditor);
          if (range) {
            end = range.end.character;
          } else {
            end = selection.end.character;
          }
        }
        let text = textEditor.document.lineAt(index).text.slice(start, end);
        const matches = text.match(regexExpG);
        numOcurrences += matches ? matches.length : 0;
        if (numOcurrences == 0) { continue; }
        const regex = regexExpG;
        const newText = text.replace(regex, replaceFunction);
        const selectionTmp = new vscode.Selection(index, start, index, end);
        const key = `${index}-${start}-${end}`;
        if (!changesMade.has(key)) {
          changesMade.set(key, true);
          builder.replace(selectionTmp, newText);
        }
      }
      return;
    }, this);
    if (numOcurrences == 0) {
      vscode.window.showWarningMessage(MESSAGES.NO_VALUE_TRANSFORMED);
    } else {
      vscode.window.showInformationMessage(MESSAGES.TRANSFORM_SUCCESS);
    }
  })
    .then(success => {
      textEditor.selections.forEach((selection, index, newSelections) => {
        if (selections[index].start.isEqual(selections[index].end)) {
          const newPosition = selection.end;
          const newSelection = new vscode.Selection(newPosition, newPosition);
          textEditor.selections[index] = newSelection;
        }
      });
      textEditor.selections = textEditor.selections;
      if (!success) {
        console.log(`Error: ${success}`);
      }
    });
};

function findValueRangeToConvert(selection, regexString, textEditor) {
  const line = selection.start.line;
  const startChar = selection.start.character;
  const text = textEditor.document.lineAt(line).text;
  const regexExpG = new RegExp(regexString, "ig");

  let result;
  while ((result = regexExpG.exec(text))) {
    const resultStart = result.index;
    const resultEnd = result.index + result[0].length;
    if (startChar >= resultStart && startChar <= resultEnd) {
      return new vscode.Range(line, resultStart, line, resultEnd);
    }
  }
  return null;
}

function deactivate() { }

exports.activate = activate;
module.exports = {
  activate,
  deactivate
}
