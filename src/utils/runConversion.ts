import { window, Selection } from 'vscode';
import { COMMAND_KEYS, MESSAGES } from '@/constant';
import {
  getConvertedResultConfig,
  getConvertedResult,
} from './getConvertedResult';
import { TransformConfiguration } from './getTransformConfiguration';
import { findSmallestValueRange } from './findSmallestValueRange';

export function runConversion(
  config: TransformConfiguration,
  commandType: COMMAND_KEYS
) {
  const { activeTextEditor: textEditor, showErrorMessage } = window;
  if (!textEditor || textEditor.selections.length === 0) {
    return showErrorMessage('No selection');
  }

  textEditor.edit((builder) => {
    const { showInformationMessage, showWarningMessage } = window;
    let totalConversion = 0;

    // Iterate over each cursor selection
    textEditor.selections.forEach((selection) => {
      for (let i = selection.start.line; i <= selection.end.line; i++) {
        // case1: middle selection (besides first and end line, it must start from zero)
        const col = {
          start: 0,
          // https://code.visualstudio.com/api/references/vscode-api#Position
          end: textEditor.document.lineAt(i).range.end.character,
        };
        const convertConfig = getConvertedResultConfig(config, commandType);

        // case2: first line or only one line
        if (i === selection.start.line) {
          const range = findSmallestValueRange(
            i,
            selection.start.character,
            convertConfig.regexExpG,
            textEditor
          );
          col.start = range ? range.start.character : selection.start.character;
        }

        // why not else if: consider the situation select only one line: i === selection.end.line && i === selection.start.line.
        // case3: end line or only one line
        if (i === selection.end.line) {
          const range = findSmallestValueRange(
            i,
            selection.end.character,
            convertConfig.regexExpG,
            textEditor
          );
          col.end = range ? range.end.character : selection.end.character;
        }

        const originalText = textEditor.document
          .lineAt(i)
          .text.slice(col.start, col.end);
        showErrorMessage(`${col.start}`);
        const { convertedText, matcheCounts } = getConvertedResult(
          originalText,
          convertConfig
        );

        if (matcheCounts === 0) continue;

        const selectionTmp = new Selection(i, col.start, i, col.end);
        builder.replace(selectionTmp, convertedText);
        totalConversion += matcheCounts;
      }
    });

    if (totalConversion === 0) {
      showWarningMessage(MESSAGES.NO_VALUE_TRANSFORMED);
    } else {
      showInformationMessage(MESSAGES.TRANSFORM_SUCCESS);
    }
  });
}
