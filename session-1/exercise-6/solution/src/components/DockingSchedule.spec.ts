import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from 'vitest';
import { render } from '@testing-library/vue';
import DockingSchedule from './DockingSchedule.vue';
import { ref, computed } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import type {
  Spacecraft,
  DockingWithSpacecraft,
} from '@/types';
import { useSpacecraft } from '@/composables/useSpacecraft';
import { useMockServer } from '../../tests/useMockServer';

// Mock child components
vi.mock('./VideoViewerModal.vue', () => ({
  default: {
    name: 'VideoViewerModal',
    template:
      '<div data-testid="video-viewer-modal"></div>',
  },
}));

// Mock composables
vi.mock('@/composables/useSpacecraft', () => ({
  useSpacecraft: vi.fn(),
}));

const { useMockDockings, useErrorFetchingDockings } =
  useMockServer();

describe('DockingSchedule', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    setActivePinia(createPinia());
  });

  const mockSpacecrafts = ref<
    (Spacecraft | { captainName: string })[]
  >([
    {
      id: '1',
      name: 'Spacecraft 1',
      captainName: 'Captain 1',
      type: 'Cargo',
    },
    {
      id: '2',
      name: 'Spacecraft 2',
      captainName: 'Captain 2',
      type: 'Passenger',
    },
  ]);

  const mockDockings: DockingWithSpacecraft[] = [
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
  ];

  const setupMocks = ({
    spacecraftLoading = false,
    spacecraftError = null,
    dockings = mockDockings,
  }: {
    spacecraftLoading?: boolean;
    spacecraftError?: Error | null;
    dockings?: DockingWithSpacecraft[];
  } = {}) => {
    vi.mocked(useSpacecraft).mockReturnValue({
      spacecrafts: computed(
        () => mockSpacecrafts.value as Spacecraft[]
      ),
      loading: computed(() => spacecraftLoading),
      error: computed(() => spacecraftError),
      addSpacecraft: vi.fn(),
      updateSpacecraft: vi.fn(),
    });
    useMockDockings(dockings);
  };

  describe('Component Rendering', () => {
    it('renders the component with title and schedule button', async () => {
      setupMocks();
      const { findByText } = render(DockingSchedule);

      expect(
        await findByText('Docking Schedule')
      ).toBeTruthy();
      expect(
        await findByText('Schedule Docking')
      ).toBeTruthy();
    });

    it('displays loading state when dockings are being fetched', async () => {
      setupMocks({ dockings: [] }); // Empty array to simulate loading state
      const { findByText } = render(DockingSchedule);

      expect(await findByText('Loading...')).toBeTruthy();
    });

    it('displays docking entries when data is loaded', async () => {
      setupMocks();
      const { findByText } = render(DockingSchedule);

      expect(await findByText('Spacecraft 1')).toBeTruthy();
      expect(await findByText('Captain 1')).toBeTruthy();
      expect(await findByText('Spacecraft 2')).toBeTruthy();
      expect(await findByText('Captain 2')).toBeTruthy();
    });

    it('displays error message when there is an error in the docking store', async () => {
      setupMocks();
      useErrorFetchingDockings();
      const { findByText } = render(DockingSchedule);

      expect(
        await findByText('Error fetching dockings')
      ).toBeTruthy();
    });
  });

  describe('Docking Scans', () => {
    it('does not display "View Scan" button for dockings without scans', async () => {
      setupMocks({
        dockings: [
          {
            id: '1',
            spacecraftId: '1',
            dockingTime: '2023-04-15T10:00:00Z',
            bayId: 1,
            status: 'docked',
          },
        ],
      });
      const { queryByText } = render(DockingSchedule);

      expect(await queryByText('View Scan')).toBeNull();
    });

    it('displays "View Scan" button for dockings with scans', async () => {
      setupMocks({
        dockings: [
          {
            id: '2',
            spacecraftId: '2',
            dockingTime: '2023-04-16T14:00:00Z',
            bayId: 2,
            status: 'docked',
            scan: new Blob(),
          },
        ],
      });
      const { findByText } = render(DockingSchedule);

      expect(await findByText('View Scan')).toBeTruthy();
    });

    it('does not display "Record Scan" button for scheduled or departed dockings', async () => {
      setupMocks({
        dockings: [
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
            status: 'departed',
            scan: new Blob(),
          },
        ],
      });
      const { queryByText } = render(DockingSchedule);

      expect(await queryByText('Record Scan')).toBeNull();
    });

    it('displays "Record Scan" button for docked spacecraft', async () => {
      setupMocks({
        dockings: [
          {
            id: '2',
            spacecraftId: '2',
            dockingTime: '2023-04-16T14:00:00Z',
            bayId: 2,
            status: 'docked',
          },
        ],
      });
      const { findByText } = render(DockingSchedule);

      expect(await findByText('Record Scan')).toBeTruthy();
    });
  });
});
