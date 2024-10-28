import { test, expect } from '@playwright/test';

// The path to the dockings page
const DOCKINGS_PATH = '/dockings';

/**
 * Helper function to format a date to be used to set the value of a datetime-local input.
 *
 * @param {Date} date - The date to format
 * @returns {string} - The formatted date string
 */
function formatDateForInput(date) {
  // Get the components of the date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    '0'
  ); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(
    2,
    '0'
  );

  // Format the string according to the 'datetime-local' input requirements
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Helper function to format a date in the same way our page displays dates.
 *
 * @param {Date} date - The date to format
 * @returns {string} - The formatted date string
 */
function formatDateForDisplay(date) {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
}

test.describe('Docking Schedule', () => {
  // This will need to be filled in
  test.beforeEach(async ({ page }) => {});

  // Task 1
  test('displays the list of scheduled dockings', async ({
    page,
  }) => {});

  // (Stretch) Task 2
  test('allows scheduling a new docking', async ({
    page,
  }) => {});
});
