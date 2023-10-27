import * as vscode from 'vscode';

import { CONFIGURATION_PREFIX } from '@/constant';

export type TransformConfiguration = ReturnType<
  typeof getTransformConfiguration
>;

export const getTransformConfiguration = () => {
  const config = vscode.workspace.getConfiguration(CONFIGURATION_PREFIX);
  return {
    multiplier: config.get<number>('multiplier'),
    targetUnit: config.get<string>('targetUnit'),
    sourceUnit: config.get<string>('sourceUnit'),
    unitPrecision: config.get<number>('unitPrecision'),
  };
};
