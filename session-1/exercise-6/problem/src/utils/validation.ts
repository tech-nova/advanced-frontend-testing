import {
  Spacecraft,
  DockingWithSpacecraft,
  ValidationErrors,
} from '../types';

export const validateSpacecraft = (
  data: Spacecraft
): ValidationErrors => {
  const errors: ValidationErrors = {}; // Object to store validation errors

  // Check if the spacecraft name is provided and not empty
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Spacecraft name is required.';
  }

  // Check if the spacecraft type is provided and not empty
  if (!data.type || data.type.trim() === '') {
    errors.type = 'Spacecraft type is required.';
  }

  // Check if the captain name is provided and not empty
  if (!data.captain || data.captain.trim() === '') {
    errors.captain = 'Captain name is required.';
  }

  return errors; // Return the errors object
};

export const validateDocking = (
  data: Partial<DockingWithSpacecraft>
): ValidationErrors => {
  const errors: ValidationErrors = {}; // Object to store validation errors

  // Check if a spacecraft is selected
  if (!data.spacecraft) {
    errors.spacecraft = 'Spacecraft selection is required.';
  }

  // Check if docking time is provided
  if (!data.dockingTime) {
    errors.dockingTime = 'Docking time is required.';
  } else {
    const dockingTime = new Date(data.dockingTime); // Convert docking time to Date object
    // Check if docking time is in the future
    if (dockingTime <= new Date()) {
      errors.dockingTime =
        'Docking time must be in the future.';
    }
  }

  // Check if a docking bay is selected
  if (!data.bayId) {
    errors.bayId = 'Docking bay selection is required.';
  }

  return errors; // Return the errors object
};
