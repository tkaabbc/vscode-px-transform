import { COMMAND_KEYS, NUM_REGEXP } from '@/constant';
import { divisionTransform, multipilicationTransform } from './transform';
import { TransformConfiguration } from './getTransformConfiguration';

type ConvertConfig = {
  convertFunction: typeof divisionTransform | typeof multipilicationTransform;
  sourceUnit: string;
  targetUnit: string;
  regexExpG: RegExp;
  multiplier: number;
  unitPrecision: number;
};

export const getConvertedResult = (
  text,
  {
    convertFunction,
    regexExpG,
    targetUnit,
    multiplier,
    unitPrecision,
  }: ConvertConfig
) => {
  const matches = text.match(regexExpG) || [];
  if (!matches.length) {
    return {
      convertedText: text,
      matcheCounts: 0,
    };
  }

  const convertedText = text.replace(regexExpG, (_, value) => {
    return `${convertFunction(value, multiplier, unitPrecision)}${targetUnit}`;
  });
  return {
    convertedText,
    matcheCounts: matches.length,
  };
};

export const getConvertedResultConfig = (
  vscodeTransformConfig: TransformConfiguration,
  commandType: COMMAND_KEYS
) => {
  const { multiplier, targetUnit, sourceUnit, unitPrecision } =
    vscodeTransformConfig;

  const config: ConvertConfig = {
    convertFunction: null,
    sourceUnit: null,
    targetUnit: null,
    regexExpG: null,
    multiplier,
    unitPrecision,
  };

  switch (commandType) {
    case COMMAND_KEYS.TRANSFORM:
      config.convertFunction = multipilicationTransform;
      config.sourceUnit = sourceUnit;
      config.targetUnit = targetUnit;
      break;

    case COMMAND_KEYS.INVERSE_TRANSFORM:
      config.convertFunction = divisionTransform;
      config.sourceUnit = targetUnit;
      config.targetUnit = sourceUnit;
      break;

    default:
      throw new Error('commandType error');
  }
  config.regexExpG = new RegExp(`${NUM_REGEXP}${config.sourceUnit}`, 'ig');

  return config;
};
