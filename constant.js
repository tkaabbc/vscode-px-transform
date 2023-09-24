const COMMAND_KEYS = {
    TRANSFORM: 'px-transform.multiply',
    INVERSE_TRANSFORM: 'px-transform.divide',
}

const CONFIGURATION_PREFIX = 'transform';

const NUM_REGEXP = '([0-9]*\\.?[0-9]+)';
const MESSAGES = {
    NO_VALUE_TRANSFORMED: "There were no values to transform",
    TRANSFORM_SUCCESS: "Transform Success",
    INVERSE_TRANSFORM_FAIL: "Inverse transform cannot be performed when the multiplier is 0",
};

module.exports = {
    COMMAND_KEYS,
    CONFIGURATION_PREFIX,
    NUM_REGEXP,
    MESSAGES,
}