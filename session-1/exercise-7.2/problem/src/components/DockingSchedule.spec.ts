import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/vue';
import DockingSchedule from './DockingSchedule.vue';
import { createPinia, setActivePinia } from 'pinia';
import type {
  Spacecraft,
  DockingWithSpacecraft,
} from '@/types';
import { useMockServer } from '../../tests/useMockServer';

const {
  useMockDockings,
  useMockSpacecrafts,
  useErrorFetchingDockings,
} = useMockServer();

describe('DockingSchedule', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const mockSpacecrafts: Spacecraft[] = [
    {
      id: 'spacecraft-1',
      name: 'Apollo Voyager',
      captain: 'John Doe',
      type: 'Cargo',
    },
    {
      id: 'spacecraft-2',
      name: 'Artemis Explorer',
      captain: 'Jane Smith',
      type: 'Research',
    },
  ];

  const mockDockings: DockingWithSpacecraft[] = [
    {
      id: 'docking-1',
      spacecraftId: 'spacecraft-1',
      dockingTime: '2023-04-15T10:00:00Z',
      bayId: 1,
      status: 'scheduled',
    },
    {
      id: 'docking-2',
      spacecraftId: 'spacecraft-2',
      dockingTime: '2023-04-16T14:30:00Z',
      bayId: 2,
      status: 'docked',
    },
  ];

  const setupMocks = ({
    dockings = mockDockings,
    spacecrafts = mockSpacecrafts,
  } = {}) => {
    useMockDockings(dockings);
    useMockSpacecrafts(spacecrafts);
  };

  describe('Component Rendering', () => {
    it('renders the component with title and schedule button', async () => {
      // 👇 Set up mocks here
      const { findByText } = render(DockingSchedule);

      expect(
        await findByText('Docking Schedule')
      ).toBeTruthy();
      expect(
        await findByText('Schedule Docking')
      ).toBeTruthy();
    });

    it('displays loading state when dockings are being fetched', async () => {
      // 👇 Set up mocks here
      const { findByText } = render(DockingSchedule);

      expect(await findByText('Loading...')).toBeTruthy();
    });

    it('displays docking entries when data is loaded', async () => {
      // 👇 Set up mocks here
      const { findByText } = render(DockingSchedule);

      expect(
        await findByText('Apollo Voyager')
      ).toBeTruthy();
      expect(
        await findByText('Artemis Explorer')
      ).toBeTruthy();
      expect(await findByText('John Doe')).toBeTruthy();
      expect(await findByText('Jane Smith')).toBeTruthy();
    });

    it('displays error message when there is an error in the docking store', async () => {
      // 👇 Set up mocks here
      const { findByText } = render(DockingSchedule);

      expect(
        await findByText('Error fetching dockings')
      ).toBeTruthy();
    });
  });

  describe('Docking Scans', () => {
    it('does not display "View Scan" button for dockings without scans', async () => {
      // 👇 Set up mocks here
      const { queryByText } = render(DockingSchedule);

      expect(await queryByText('View Scan')).toBeNull();
    });

    it('displays "View Scan" button for dockings with scans', async () => {
      // 👇 Set up mocks here
      const { findByText } = render(DockingSchedule);

      expect(await findByText('View Scan')).toBeTruthy();
    });

    it('does not display "Record Scan" button for scheduled or departed dockings', async () => {
      // 👇 Set up mocks here
      const { queryByText } = render(DockingSchedule);

      expect(await queryByText('Record Scan')).toBeNull();
    });

    it('displays "Record Scan" button for docked spacecraft', async () => {
      // 👇 Set up mocks here
      const { findByText } = render(DockingSchedule);

      expect(await findByText('Record Scan')).toBeTruthy();
    });
  });
});
