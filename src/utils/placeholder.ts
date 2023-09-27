import * as vscode from 'vscode';

import { MESSAGES } from '@/constant';

import { findValueRangeToConvert } from './findValueRangeToConvert';

export function placeholder(regPattern, replaceFunction, textEditor) {
  const { selections } = textEditor;
  if (
    (selections.length === 0 ||
      selections.reduce((acc, val) => acc || val.isEmpty),
    false)
  ) {
    return;
  }
  textEditor
    .edit((builder) =>
      edit(builder, selections, textEditor, regPattern, replaceFunction)
    )
    .then((success) => {
      textEditor.selections.forEach((selection, index) => {
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
}

const edit = (builder, selections, textEditor, regPattern, replaceFunction) => {
  const changesMade = new Map();
  const regexExpG = new RegExp(regPattern, 'ig');
  let numOcurrences = 0;

  selections.forEach((selection) => {
    for (
      let index = selection.start.line;
      index <= selection.end.line;
      index++
    ) {
      let start = 0;
      let end = textEditor.document.lineAt(index).range.end.character;
      if (index === selection.start.line) {
        const tmpSelection = selection.with({ end: selection.start });
        const range = findValueRangeToConvert(
          tmpSelection,
          regPattern,
          textEditor
        );
        start = range ? range.start.character : selection.start.character;
      }
      if (index === selection.end.line) {
        const tmpSelection = selection.with({ start: selection.end });
        const range = findValueRangeToConvert(
          tmpSelection,
          regPattern,
          textEditor
        );
        end = range ? range.end.character : selection.end.character;
      }
      const text = textEditor.document.lineAt(index).text.slice(start, end);
      const matches = text.match(regexExpG);
      numOcurrences += matches ? matches.length : 0;
      if (numOcurrences !== 0) {
        const newText = text.replace(regexExpG, replaceFunction);
        const selectionTmp = new vscode.Selection(index, start, index, end);
        const key = `${index}-${start}-${end}`;
        if (!changesMade.has(key)) {
          changesMade.set(key, true);
          builder.replace(selectionTmp, newText);
        }
      }
    }
  });
  if (numOcurrences === 0) {
    vscode.window.showWarningMessage(MESSAGES.NO_VALUE_TRANSFORMED);
  } else {
    vscode.window.showInformationMessage(MESSAGES.TRANSFORM_SUCCESS);
  }
};
