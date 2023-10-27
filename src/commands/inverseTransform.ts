import { COMMAND_KEYS } from '@/constant';
import { getTransformConfiguration, runConversion } from '@/utils';

export const inverseTransform = () => {
  runConversion(getTransformConfiguration(), COMMAND_KEYS.INVERSE_TRANSFORM);
};
