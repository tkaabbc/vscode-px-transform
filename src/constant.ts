export const enum COMMAND_KEYS {
  TRANSFORM = 'px-transform.multiply',
  INVERSE_TRANSFORM = 'px-transform.divide',
}

export const CONFIGURATION_PREFIX = 'transform';

export const NUM_REGEXP = '([0-9]*\\.?[0-9]+)';

export const enum MESSAGES {
  NO_VALUE_TRANSFORMED = 'There were no values to transform',
  TRANSFORM_SUCCESS = 'Transform Success',
  INVERSE_TRANSFORM_FAIL = 'Inverse transform cannot be performed when the multiplier is 0',
}
