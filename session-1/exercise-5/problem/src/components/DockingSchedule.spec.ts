import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from 'vitest';
import { render, screen } from '@testing-library/vue';
import { computed, ref } from 'vue';
import { useSpacecraft } from '@/composables/useSpacecraft';
import { useDocking } from '@/composables/useDocking';
import DockingSchedule from './DockingSchedule.vue';

// Mock child components
vi.mock('./DockingForm.vue', () => ({
  default: {
    name: 'DockingForm',
    template: '<div data-testid="docking-form"></div>',
  },
}));
vi.mock('./VideoScanModal.vue', () => ({
  default: {
    name: 'VideoScanModal',
    template: '<div data-testid="video-scan-modal"></div>',
  },
}));
vi.mock('./VideoViewerModal.vue', () => ({
  default: {
    name: 'VideoViewerModal',
    template: '<div data-testid="video-viewer-modal"></div>',
  },
}));

// Mock composables
vi.mock('@/composables/useSpacecraft', () => ({
  useSpacecraft: vi.fn(),
}));
vi.mock('@/composables/useDocking', () => ({
  useDocking: vi.fn(),
}));

const mockSpacecrafts = ref([
  {
    id: '1',
    name: 'Spacecraft 1',
    captain: 'Captain 1',
    type: 'type1',
  },
  {
    id: '2',
    name: 'Spacecraft 2',
    captain: 'Captain 2',
    type: 'type2',
  },
]);

const mockDockings = ref([
  {
    id: '1',
    spacecraftId: '1',
    dockingTime: '2023-04-15T10:00:00Z',
    bayId: 1,
    status: 'scheduled',
  },
  {
    id: '2',
    spacecraftId: '2',
    dockingTime: '2023-04-16T14:00:00Z',
    bayId: 2,
    status: 'docked',
    scan: new Blob(),
  },
]);

const setupMocks = ({
  spacecraftLoading = false,
  spacecraftError = null,
  dockingLoading = false,
  dockingError = null,
  dockings = mockDockings,
} = {}) => {
  vi.mocked(useSpacecraft).mockReturnValue({
    spacecrafts: computed(() => mockSpacecrafts.value),
    loading: computed(() => spacecraftLoading),
    error: computed(() => spacecraftError),
    addSpacecraft: vi.fn(),
    updateSpacecraft: vi.fn(),
  });

  vi.mocked(useDocking).mockReturnValue({
    dockings: computed(() => dockings.value),
    loading: computed(() => dockingLoading),
    error: computed(() => dockingError || null),
    scheduleDocking: vi.fn(),
    updateDocking: vi.fn(),
    addScanToDocking: vi.fn(),
  });
};

describe('DockingSchedule', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('Component Rendering', () => {
    it('renders the component with title and schedule button', () => {
      setupMocks();
      render(DockingSchedule);
      expect(screen.getByText('Docking Schedule')).toBeTruthy();
      expect(screen.getByText('Schedule Docking')).toBeTruthy();
    });

    it('displays loading state when dockings are being fetched', () => {
      setupMocks({ dockingLoading: true });
      render(DockingSchedule);
      expect(screen.getByText('Loading...')).toBeTruthy();
    });

    it('displays docking entries when data is loaded', () => {
      setupMocks();
      render(DockingSchedule);
      expect(screen.getByText('Spacecraft 1')).toBeTruthy();
      expect(screen.getByText('Spacecraft 2')).toBeTruthy();
    });

    it('displays error message when there is an error in the docking store', () => {
      setupMocks({ dockingError: new Error('Test error message') });
      render(DockingSchedule);
      expect(screen.getByText('Test error message')).toBeTruthy();
    });
  });

  describe('Docking Scans', () => {
    it('does not display "View Scan" button for dockings without scans', () => {
      const dockings = ref([
        {
          id: '1',
          spacecraftId: '1',
          dockingTime: '2023-04-15T10:00:00Z',
          bayId: 1,
          status: 'scheduled',
        },
      ]);
      setupMocks({ dockings });
      render(DockingSchedule);
      expect(screen.queryByText('View Scan')).toBeNull();
    });

    it('displays "View Scan" button for dockings with scans', () => {
      const dockings = ref([
        {
          id: '2',
          spacecraftId: '2',
          dockingTime: '2023-04-16T14:00:00Z',
          bayId: 2,
          status: 'docked',
          scan: new Blob(),
        },
      ]);
      setupMocks({ dockings });
      render(DockingSchedule);
      expect(screen.getByText('View Scan')).toBeTruthy();
    });

    it('does not display "Record Scan" button for scheduled or departed dockings', () => {
      const dockings = ref([
        {
          id: '1',
          spacecraftId: '1',
          dockingTime: '2023-04-15T10:00:00Z',
          bayId: 1,
          status: 'scheduled',
        },
        {
          id: '3',
          spacecraftId: '1',
          dockingTime: '2023-04-17T10:00:00Z',
          bayId: 1,
          status: 'departed',
        },
      ]);
      setupMocks({ dockings });
      render(DockingSchedule);
      expect(screen.queryByText('Record Scan')).toBeNull();
    });

    it('displays "Record Scan" button for docked spacecraft', () => {
      const dockings = ref([
        {
          id: '2',
          spacecraftId: '2',
          dockingTime: '2023-04-16T14:00:00Z',
          bayId: 2,
          status: 'docked',
        },
      ]);
      setupMocks({ dockings });
      render(DockingSchedule);
      expect(screen.getByText('Record Scan')).toBeTruthy();
    });
  });
});
