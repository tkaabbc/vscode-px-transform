import { COMMAND_KEYS } from '@/constant';
import { getTransformConfiguration, runConversion } from '@/utils';

export const transform = () => {
  runConversion(getTransformConfiguration(), COMMAND_KEYS.TRANSFORM);
};
