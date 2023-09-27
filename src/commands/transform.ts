import { NUM_REGEXP } from '@/constant';
import {
  getTransformConfiguration,
  multipilicationTransform,
  placeholder,
} from '@/utils';

export const transform = (textEditor) => {
  const { multiplier, targetUnit, sourceUnit, unitPrecision } =
    getTransformConfiguration();
  const regexStr = `${NUM_REGEXP}${sourceUnit}`;
  placeholder(
    regexStr,
    (_, value) =>
      `${multipilicationTransform(
        value,
        multiplier,
        unitPrecision
      )}${targetUnit}`,
    textEditor
  );
};
