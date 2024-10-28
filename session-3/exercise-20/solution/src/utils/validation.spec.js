import { describe, it, expect } from 'vitest';
import {
  validateSpacecraft,
  validateDocking,
} from './validation';

describe('validateSpacecraft', () => {
  const validSpacecraft = {
    name: 'Voyager',
    type: 'Explorer',
    captain: 'Janeway',
  };

  it('should return no errors for valid spacecraft data', () => {
    const errors = validateSpacecraft(validSpacecraft);
    expect(errors).toEqual({});
  });

  it('should return errors for missing fields', () => {
    const invalidSpacecraft = {};
    const errors = validateSpacecraft(invalidSpacecraft);

    expect(errors).toEqual({
      name: 'Spacecraft name key is missing',
      type: 'Spacecraft type key is missing',
      captain: 'Captain name key is missing',
    });
  });

  it('should validate each field correctly', () => {
    const testCases = [
      {
        field: 'name',
        invalid: ' ',
        error: 'Spacecraft name cannot be empty',
      },
      {
        field: 'type',
        invalid: 123,
        error: 'Spacecraft type must be a string',
      },
      {
        field: 'captain',
        invalid: 'Kirk@Enterprise',
        error: 'Captain name contains invalid characters',
      },
    ];

    testCases.forEach(({ field, invalid, error }) => {
      const spacecraft = {
        ...validSpacecraft,
        [field]: invalid,
      };
      const errors = validateSpacecraft(spacecraft);
      expect(errors[field]).toBe(error);
    });
  });
});

describe('validateDocking', () => {
  const tomorrow = new Date(
    Math.floor((Date.now() + 86400000) / 1000) * 1000
  );

  const validDocking = {
    spacecraftId: 'voyager1',
    dockingTime: tomorrow.toISOString(),
    bayId: 42,
  };

  it('should return no errors for valid docking data', () => {
    const errors = validateDocking(validDocking);
    expect(errors).toEqual({});
  });

  it('should return errors for missing fields', () => {
    const invalidDocking = {};
    const errors = validateDocking(invalidDocking);

    expect(errors).toEqual({
      spacecraftId: 'Spacecraft ID key is missing',
      dockingTime: 'Docking time key is missing',
      bayId: 'Bay ID key is missing',
    });
  });

  it('should validate spacecraftId correctly', () => {
    const testCases = [
      {
        invalid: null,
        error: 'Spacecraft ID cannot be null or undefined',
      },
      {
        invalid: 123,
        error: 'Spacecraft ID must be a string',
      },
      {
        invalid: ' ',
        error: 'Spacecraft ID cannot be empty',
      },
    ];

    testCases.forEach(({ invalid, error }) => {
      const docking = {
        ...validDocking,
        spacecraftId: invalid,
      };
      const errors = validateDocking(docking);
      expect(errors.spacecraftId).toBe(error);
    });
  });

  it('should validate dockingTime correctly', () => {
    const past = new Date(Date.now() - 86400000);
    const farFuture = new Date(
      Date.now() + 31 * 365.25 * 86400000
    );
    const nonWholeSecond = new Date(
      Date.now() + 86400000 + 100
    );

    const testCases = [
      {
        invalid: past.toISOString(),
        error: 'Docking time must be in the future',
      },
      {
        invalid: farFuture.toISOString(),
        error:
          'Docking time cannot be more than 30 years in the future',
      },
      {
        invalid: nonWholeSecond.toISOString(),
        error:
          'Docking time must be at a whole second boundary',
      },
    ];

    testCases.forEach(({ invalid, error }) => {
      const docking = {
        ...validDocking,
        dockingTime: invalid,
      };
      const errors = validateDocking(docking);
      expect(errors.dockingTime).toBe(error);
    });
  });

  it('should validate bayId correctly', () => {
    const testCases = [
      {
        invalid: undefined,
        error: 'Bay ID must be a number',
      },
      {
        invalid: null,
        error: 'Bay ID must be a number',
      },
      {
        invalid: '42',
        error: 'Bay ID must be a number',
      },
      {
        invalid: 0,
        error: 'Bay ID must be between 1 and 1000',
      },
      {
        invalid: 1001,
        error: 'Bay ID must be between 1 and 1000',
      },
      {
        invalid: 42.5,
        error: 'Bay ID must be an integer',
      },
    ];

    testCases.forEach(({ invalid, error }) => {
      const docking = {
        ...validDocking,
        bayId: invalid,
      };
      const errors = validateDocking(docking);
      expect(errors.bayId).toBe(error);
    });
  });

  it('should handle Enterprise special case', () => {
    const enterpriseDocking = {
      spacecraftId: '3n73rpr153',
      dockingTime: tomorrow.toISOString(),
      bayId: 1701,
    };

    const errors = validateDocking(enterpriseDocking);
    expect(errors.bayId).toBe(
      'Enterprise cannot dock in bay 1701 due to historical reasons'
    );
  });
});
