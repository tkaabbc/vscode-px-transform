import { CONFIGURATION_PREFIX } from '@/constant';
import * as vscode from 'vscode';

export const getTransformConfiguration = () => {
  const config = vscode.workspace.getConfiguration(CONFIGURATION_PREFIX);
  return {
    multiplier: config.get('multiplier'),
    targetUnit: config.get('targetUnit'),
    sourceUnit: config.get('sourceUnit'),
    unitPrecision: config.get('unitPrecision'),
  };
};
