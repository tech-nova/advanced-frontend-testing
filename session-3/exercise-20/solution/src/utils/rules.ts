import {
  required as isRequired,
  isNull as isNullRule,
  isString as isStringRule,
  notEmpty as notEmptyRule,
  validChars as validCharsRule,
  isNumber as isNumberRule,
  isInteger as isIntegerRule,
  range as rangeRule,
  futureDate as futureDateRule,
} from './validator/rules';
import type { ValidationRule } from './validator/validator';
import { interpolateFieldName } from './validator/rules';

type RuleFactory<T = unknown> = (
  fieldName?: string
) => ValidationRule<T>;

export const required: RuleFactory = (fieldName?) => ({
  validate: (value: unknown) => {
    if (
      isNullRule(fieldName).validate(value) ||
      isRequired(fieldName).validate(value)
    ) {
      return interpolateFieldName(
        'Field cannot be null or undefined',
        fieldName
      );
    }
    return null;
  },
});

// Re-export other rules with our own naming/interface
export const isString = isStringRule;
export const notEmpty = notEmptyRule;
export const validChars = validCharsRule;
export const isNumber = isNumberRule;
export const isInteger = isIntegerRule;
export const range = rangeRule;
export const futureDate = futureDateRule;

// Export the type for consumers of our validation facade
export type { ValidationRule };
