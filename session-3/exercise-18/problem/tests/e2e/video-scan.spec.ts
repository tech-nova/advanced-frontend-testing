import { test, expect } from '@playwright/test';
import { mockWebcam } from '../mocks/webcam';

const DOCKINGS_PATH = '/dockings';

test.describe('Docking Schedule - Video Scan', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the docking schedule page before each test
    await page.goto(DOCKINGS_PATH);

    // Mock the webcam
    await mockWebcam(page);
  });

  test('records a video scan', async ({ page }) => {
    // Find a docked spacecraft and click "Record Scan"
    const dockedRow = page.getByRole('row', {
      name: /docked/i,
    });
    await dockedRow
      .getByRole('button', { name: 'Record Scan' })
      .click();

    // Wait for the video scan modal to appear
    const modal = page.getByRole('dialog', {
      name: 'Record Video Scan',
    });
    await expect(modal).toBeVisible();

    // Start recording
    await modal
      .getByRole('button', { name: 'Start Recording' })
      .click();

    // Wait for the countdown
    await expect(modal.getByText('3')).toBeVisible();
    await expect(modal.getByText('2')).toBeVisible();
    await expect(modal.getByText('1')).toBeVisible();

    // Check if recording has started
    await expect(modal.getByText('00:00')).toBeVisible();

    // Wait for a few seconds of recording
    await page.waitForTimeout(3000);

    // Stop recording
    await modal
      .getByRole('button', { name: 'Stop Recording' })
      .click();

    // Check if preview is visible
    await expect(modal.getByText('Preview:')).toBeVisible();
    await expect(
      modal.locator('video[controls]')
    ).toBeVisible();

    // Submit the scan
    await modal
      .getByRole('button', { name: 'Submit Scan' })
      .click();

    // Verify the modal is closed
    await expect(modal).not.toBeVisible();

    // Check if the "View Scan" button is now visible for this docking
    await expect(
      dockedRow.getByRole('button', { name: 'View Scan' })
    ).toBeVisible();
  });
});
