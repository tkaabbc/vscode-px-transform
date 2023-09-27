import * as vscode from 'vscode';

import { CONFIGURATION_PREFIX } from '@/constant';

export const getTransformConfiguration = () => {
  const config = vscode.workspace.getConfiguration(CONFIGURATION_PREFIX);
  return {
    multiplier: config.get('multiplier'),
    targetUnit: config.get('targetUnit'),
    sourceUnit: config.get('sourceUnit'),
    unitPrecision: config.get('unitPrecision'),
  };
};
