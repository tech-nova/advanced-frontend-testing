export const spacecraftData = [
  {
    id: 'sc1',
    name: 'Apollo Voyager',
    type: 'Cargo',
    captain: 'John Doe',
  },
  {
    id: 'sc2',
    name: 'Artemis Explorer',
    type: 'Passenger',
    captain: 'Jane Smith',
  },
  {
    id: 'sc3',
    name: 'Borealis Pioneer',
    type: 'Research',
    captain: 'Bob Johnson',
  },
  {
    id: 'sc4',
    name: 'Caelum Odyssey',
    type: 'Military',
    captain: 'Alice Brown',
  },
  {
    id: 'sc5',
    name: 'Drakon Ranger',
    type: 'Cargo',
    captain: 'Charlie Wilson',
  },
  {
    id: 'sc6',
    name: 'Eclipse Guardian',
    type: 'Passenger',
    captain: 'Eva Martinez',
  },
];

export const departingDockings = [
  {
    id: 'd1',
    spacecraftId: 'sc1',
    dockingTime: '2023-04-01T10:00:00Z',
    bayId: 1,
    status: 'departing',
  },
  {
    id: 'd2',
    spacecraftId: 'sc2',
    dockingTime: '2023-04-02T11:00:00Z',
    bayId: 2,
    status: 'departing',
  },
];

export const dockedDockings = [
  {
    id: 'd3',
    spacecraftId: 'sc3',
    dockingTime: '2023-04-03T12:00:00Z',
    bayId: 3,
    status: 'docked',
  },
  {
    id: 'd4',
    spacecraftId: 'sc4',
    dockingTime: '2023-04-04T13:00:00Z',
    bayId: 4,
    status: 'docked',
  },
];

export const scheduledDockings = [
  {
    id: 'd5',
    spacecraftId: 'sc5',
    dockingTime: '2023-04-05T14:00:00Z',
    bayId: 5,
    status: 'scheduled',
  },
  {
    id: 'd6',
    spacecraftId: 'sc6',
    dockingTime: '2023-04-06T15:00:00Z',
    bayId: 6,
    status: 'scheduled',
  },
];

export const notificationData = [
  {
    id: 'n1',
    message: 'Docking scheduled',
    timestamp: '2023-04-01T09:00:00Z',
  },
  {
    id: 'n2',
    message: 'Docking completed',
    timestamp: '2023-04-02T10:30:00Z',
  },
  {
    id: 'n3',
    message: 'Docking cancelled',
    timestamp: '2023-04-03T11:45:00Z',
  },
  {
    id: 'n4',
    message: 'Emergency docking procedure initiated',
    timestamp: '2023-04-04T13:15:00Z',
  },
  {
    id: 'n5',
    message: 'Spacecraft departed',
    timestamp: '2023-04-05T14:30:00Z',
  },
  {
    id: 'n6',
    message: 'Docking bay maintenance',
    timestamp: '2023-04-06T15:45:00Z',
  },
];
