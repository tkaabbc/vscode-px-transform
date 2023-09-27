import { MESSAGES } from '@/constant';
import * as vscode from 'vscode';

export const multipilicationTransform = (value, multiplier, unitPrecision) => {
  if (multiplier == 0) {
    return 0;
  }
  return parseFloat((value * multiplier).toFixed(unitPrecision));
};

export const divisionTransform = (value, multiplier, unitPrecision) => {
  if (multiplier == 0) {
    return vscode.window.showErrorMessage(MESSAGES.INVERSE_TRANSFORM_FAIL);
  }
  return parseFloat((value / multiplier).toFixed(unitPrecision));
};
