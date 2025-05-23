import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from 'vitest';
import { render, screen } from '@testing-library/vue';
import DockingSchedule from './DockingSchedule.vue';
import { ref, type Ref } from 'vue';
import { createPinia, setActivePinia } from 'pinia';
import type {
  Spacecraft,
  DockingWithSpacecraft,
} from '../types';
import { useSpacecraft } from '../composables/useSpacecraft';
import { useMockServer } from '../../tests/useMockServer';

vi.mock('./VideoViewerModal.vue', () => ({
  default: {
    name: 'VideoViewerModal',
    template:
      '<div data-testid="video-viewer-modal"></div>',
  },
}));

vi.mock('@/composables/useSpacecraft', () => ({
  useSpacecraft: vi.fn(),
}));

/* 🙈 This mocks the network requests, but you don't need to know how it works just yet. */
const { useMockDockings, useErrorFetchingDockings } =
  useMockServer();

describe('DockingSchedule', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    setActivePinia(createPinia());
  });

  const mockSpacecrafts = ref<Spacecraft[]>([
    {
      id: '1',
      type: 'spacecraft',
      name: 'Spacecraft 1',
      captain: 'Captain 1',
    },
    {
      id: '2',
      type: 'spacecraft',
      name: 'Spacecraft 2',
      captain: 'Captain 2',
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
      spacecrafts: mockSpacecrafts,
      loading: ref(spacecraftLoading),
      error: ref(spacecraftError),
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
            spacecraft: mockSpacecrafts.value[0],
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
            spacecraft: mockSpacecrafts.value[1],
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
            spacecraft: mockSpacecrafts.value[0],
          },
          {
            id: '2',
            spacecraftId: '2',
            dockingTime: '2023-04-16T14:00:00Z',
            bayId: 2,
            status: 'departed',
            spacecraft: mockSpacecrafts.value[1],
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
            spacecraft: mockSpacecrafts.value[1],
          },
        ],
      });
      const { findByText } = render(DockingSchedule);

      expect(await findByText('Record Scan')).toBeTruthy();
    });
  });
});
