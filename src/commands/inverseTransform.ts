import { NUM_REGEXP } from '@/constant';
import {
  divisionTransform,
  getTransformConfiguration,
  placeholder,
} from '@/utils';

export const inverseTransform = (textEditor) => {
  const { multiplier, targetUnit, sourceUnit, unitPrecision } =
    getTransformConfiguration();
  const regexStr = `${NUM_REGEXP}${targetUnit}`;
  placeholder(
    regexStr,
    (_, value) =>
      `${divisionTransform(value, multiplier, unitPrecision)}${sourceUnit}`,
    textEditor
  );
};
