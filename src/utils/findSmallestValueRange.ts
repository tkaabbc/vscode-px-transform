import * as vscode from 'vscode';

/**
 * If cursor locates at the inner of a regex matched value,the method can find the smallest Range of the value.
 * 处理光标处于数值中间的情况
 * @param selection
 * @param regex
 * @param textEditor
 * @returns
 */
export function findSmallestValueRange(line, startChar, regex, textEditor) {
  const { text } = textEditor.document.lineAt(line);
  const regexExpG = new RegExp(regex, 'ig');

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
