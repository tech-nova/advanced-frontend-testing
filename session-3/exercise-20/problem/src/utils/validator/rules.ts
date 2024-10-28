import { ValidationRule } from './validator';

const INVALID_CHARS_REGEX = /[^a-zA-Z0-9\s]/;

type RuleFactory<T = unknown> = (
  fieldName?: string
) => ValidationRule<T>;

export const interpolateFieldName = (
  message: string,
  fieldName?: string
): string =>
  fieldName ? message.replace('Field', fieldName) : message;

export const required: RuleFactory = (fieldName?) => ({
  validate: (value: unknown) =>
    value === null || value === undefined
      ? interpolateFieldName(
          'Field cannot be null or undefined',
          fieldName
        )
      : null,
});

export const isString: RuleFactory = (fieldName?) => ({
  validate: (value: unknown) =>
    typeof value !== 'string'
      ? interpolateFieldName(
          'Field must be a string',
          fieldName
        )
      : null,
});

export const notEmpty: RuleFactory<string> = (
  fieldName?
) => ({
  validate: (value: string) =>
    value.trim() === ''
      ? interpolateFieldName(
          'Field cannot be empty',
          fieldName
        )
      : null,
});

export const validChars: RuleFactory<string> = (
  fieldName?
) => ({
  validate: (value: string) =>
    INVALID_CHARS_REGEX.test(value)
      ? interpolateFieldName(
          'Field contains invalid characters',
          fieldName
        )
      : null,
});

export const isNumber: RuleFactory = (fieldName?) => ({
  validate: (value: unknown) =>
    typeof value !== 'number'
      ? interpolateFieldName(
          'Field must be a number',
          fieldName
        )
      : null,
});

export const isInteger: RuleFactory<number> = (
  fieldName?
) => ({
  validate: (value: number) =>
    !Number.isInteger(value)
      ? interpolateFieldName(
          'Field must be an integer',
          fieldName
        )
      : null,
});

export const range = (
  min: number,
  max: number,
  fieldName?: string
): ValidationRule<number> => ({
  validate: (value: number) =>
    value < min || value > max
      ? interpolateFieldName(
          `Field must be between ${min} and ${max}`,
          fieldName
        )
      : null,
});

export const futureDate: RuleFactory<string> = (
  fieldName?
) => ({
  validate: (value: string) => {
    const date = new Date(value);
    if (isNaN(date.getTime()))
      return interpolateFieldName(
        'Field must be a valid date',
        fieldName
      );
    if (date <= new Date())
      return interpolateFieldName(
        'Field must be in the future',
        fieldName
      );
    return null;
  },
});
