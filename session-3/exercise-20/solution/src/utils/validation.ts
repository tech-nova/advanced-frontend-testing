import {
  Spacecraft,
  DockingWithSpacecraft,
} from '../types';
import {
  Validator,
  ValidationErrors,
} from './validator/validator';
import {
  required,
  isString,
  notEmpty,
  validChars,
  isNumber,
  isInteger,
  range,
  futureDate,
} from './rules';

const MAX_FUTURE_YEAR = 2050;
const MIN_BAY_ID = 1;
const MAX_BAY_ID = 1000;
const ENTERPRISE_ID = '3n73rpr153';
const ENTERPRISE_FORBIDDEN_BAY = 1701;

export function createStringFieldValidator(
  displayName: string
): Validator<unknown> {
  return new Validator()
    .addRule(required(displayName))
    .addRule(isString(displayName))
    .addRule({
      validate: (value) =>
        typeof value !== 'string'
          ? `${displayName} must be a string`
          : notEmpty(displayName).validate(value),
    })
    .addRule({
      validate: (value) =>
        typeof value !== 'string'
          ? `${displayName} must be a string`
          : validChars(displayName).validate(value),
    });
}

export function validateSpacecraft(
  data: Partial<Spacecraft>
): ValidationErrors {
  const errors: ValidationErrors = {};
  const fields = {
    name: 'Spacecraft name',
    type: 'Spacecraft type',
    captain: 'Captain name',
  } as const;

  Object.entries(fields).forEach(([field, displayName]) => {
    if (!(field in data)) {
      errors[field] = `${displayName} key is missing`;
    } else {
      const validator =
        createStringFieldValidator(displayName);
      const error = validator.validate(
        data[field as keyof typeof fields]
      );
      if (error) errors[field] = error;
    }
  });

  return errors;
}

export function validateDocking(
  data: Partial<DockingWithSpacecraft>
): ValidationErrors {
  const errors: ValidationErrors = {}; // Object to store validation errors

  // Validate spacecraftId
  if (!('spacecraftId' in data)) {
    errors.spacecraftId = 'Spacecraft ID key is missing';
  } else {
    const spacecraftIdValidator =
      createStringFieldValidator('Spacecraft ID');
    const error = spacecraftIdValidator.validate(
      data.spacecraftId as string
    );
    if (error) {
      errors.spacecraftId = error;
    }
  }

  // Validate dockingTime
  if (!('dockingTime' in data)) {
    errors.dockingTime = 'Docking time key is missing';
  } else {
    const dockingTimeValidator = new Validator<string>()
      .addRule(futureDate('Docking time'))
      .addRule({
        validate: (value) => {
          const date = new Date(value);
          if (date.getFullYear() > MAX_FUTURE_YEAR) {
            return 'Docking time cannot be more than 30 years in the future';
          }
          if (date.getTime() % 1000 !== 0) {
            return 'Docking time must be at a whole second boundary';
          }
          return null;
        },
      });
    const error = dockingTimeValidator.validate(
      data.dockingTime as string
    );
    if (error) errors.dockingTime = error;
  }

  // Validate bayId
  if (!('bayId' in data)) {
    errors.bayId = 'Bay ID key is missing';
  } else {
    const bayIdValidator = new Validator<number>()
      .addRule(isNumber('Bay ID'))
      .addRule(isInteger('Bay ID'))
      .addRule(range(MIN_BAY_ID, MAX_BAY_ID, 'Bay ID'));
    const error = bayIdValidator.validate(
      data.bayId as number
    );
    if (error) errors.bayId = error;
  }

  // Enterprise special case
  if (
    data.spacecraftId === ENTERPRISE_ID &&
    data.bayId === ENTERPRISE_FORBIDDEN_BAY
  ) {
    errors.bayId =
      'Enterprise cannot dock in bay 1701 due to historical reasons';
  }

  return errors;
}
