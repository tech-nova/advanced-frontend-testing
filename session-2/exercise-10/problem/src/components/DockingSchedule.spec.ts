import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from 'vitest';
import { render } from '@testing-library/vue';
import DockingSchedule from './DockingSchedule.vue';
import { createPinia, setActivePinia } from 'pinia';
import type {
  Spacecraft,
  DockingWithSpacecraft,
} from '@/types';
import { useMockServer } from '../../tests/useMockServer';
import { faker } from '@faker-js/faker';

const {
  useMockDockings,
  useMockSpacecrafts,
  useErrorFetchingDockings,
} = useMockServer();

describe('DockingSchedule', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    setActivePinia(createPinia());
    faker.seed(1030); // Set a consistent seed for reproducible tests
  });

  const generateMockSpacecraft = (): Spacecraft => ({
    id: faker.string.uuid(),
    name: `${faker.helpers.arrayElement([
      'Apollo',
      'Artemis',
      'Borealis',
      'Caelum',
      'Drakon',
      'Eclipse',
      'Fenix',
      'Galactica',
      'Helios',
    ])} ${faker.helpers.arrayElement([
      'Voyager',
      'Explorer',
      'Pioneer',
      'Odyssey',
      'Ranger',
      'Guardian',
      'Sentinel',
      'Nomad',
      'Vanguard',
    ])}`,
    captain: faker.person.fullName(),
    type: faker.helpers.arrayElement([
      'Cargo',
      'Passenger',
      'Research',
      'Military',
    ]),
  });

  const generateMockDocking = (
    spacecraft: Spacecraft
  ): DockingWithSpacecraft => ({
    id: faker.string.uuid(),
    spacecraftId: spacecraft.id,
    dockingTime: faker.date.recent().toISOString(),
    bayId: faker.number.int({ min: 1, max: 10 }),
    status: faker.helpers.arrayElement([
      'scheduled',
      'docked',
      'departing',
    ]),
  });

  const mockSpacecrafts: Spacecraft[] = [
    generateMockSpacecraft(),
    generateMockSpacecraft(),
  ];

  const mockDockings: DockingWithSpacecraft[] = [
    generateMockDocking(mockSpacecrafts[0]),
    generateMockDocking(mockSpacecrafts[1]),
  ];

  const setupMocks = ({
    spacecrafts = mockSpacecrafts,
    dockings = mockDockings,
  }: {
    spacecrafts?: Spacecraft[];
    dockings?: DockingWithSpacecraft[];
  } = {}) => {
    useMockSpacecrafts(spacecrafts);
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

      expect(
        await findByText(mockSpacecrafts[0].name)
      ).toBeTruthy();
      expect(
        await findByText(mockSpacecrafts[0].captain)
      ).toBeTruthy();
      expect(
        await findByText(mockSpacecrafts[1].name)
      ).toBeTruthy();
      expect(
        await findByText(mockSpacecrafts[1].captain)
      ).toBeTruthy();
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
      const mockDocking = generateMockDocking(
        mockSpacecrafts[0]
      );
      mockDocking.status = 'docked';
      setupMocks({ dockings: [mockDocking] });
      const { queryByText } = render(DockingSchedule);

      expect(await queryByText('View Scan')).toBeNull();
    });

    it('displays "View Scan" button for dockings with scans', async () => {
      const mockDocking = generateMockDocking(
        mockSpacecrafts[0]
      );
      mockDocking.status = 'docked';
      mockDocking.scan = new Blob();
      setupMocks({ dockings: [mockDocking] });
      const { findByText } = render(DockingSchedule);

      expect(await findByText('View Scan')).toBeTruthy();
    });

    it('does not display "Record Scan" button for scheduled or departed dockings', async () => {
      const scheduledDocking = generateMockDocking(
        mockSpacecrafts[0]
      );
      scheduledDocking.status = 'scheduled';
      const departedDocking = generateMockDocking(
        mockSpacecrafts[1]
      );
      departedDocking.status = 'departing';
      setupMocks({
        dockings: [scheduledDocking, departedDocking],
      });
      const { queryByText } = render(DockingSchedule);

      expect(await queryByText('Record Scan')).toBeNull();
    });

    it('displays "Record Scan" button for docked spacecraft', async () => {
      const dockedDocking = generateMockDocking(
        mockSpacecrafts[0]
      );
      dockedDocking.status = 'docked';
      setupMocks({ dockings: [dockedDocking] });
      const { findByText } = render(DockingSchedule);

      expect(await findByText('Record Scan')).toBeTruthy();
    });
  });
});
