import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from 'vitest';
// import { render, screen } from '@testing-library/vue';
// import { shallowMount } from '@vue/test-utils';
// import { createTestingPinia } from '@pinia/testing';
// import { ofetch } from 'ofetch';
// import { ref } from 'vue';
// import DockingSchedule from './DockingSchedule.vue';
// import DockingForm from './DockingForm.vue';

describe('DockingSchedule', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders the component with title and schedule button', () => {});

    it('displays loading state when dockings are being fetched', () => {});

    it('displays docking entries when data is loaded', async () => {});

    it('displays error message when there is an error in the docking store', () => {});
  });

  describe('Docking Scans', () => {
    it('does not display "View Scan" button for dockings without scans', () => {});

    it('displays "View Scan" button for dockings with scans', () => {});

    it('does not display "Record Scan" button for scheduled or departed dockings', () => {});

    it('displays "Record Scan" button for docked spacecraft', () => {});
  });

  describe('Network Calls', () => {
    it('fetches dockings on mount', async () => {});

    it('schedules a new docking', async () => {});
  });
});
