// seed.ts
import db from './database';
import { faker } from '@faker-js/faker';

// Interfaces
interface Spacecraft {
  id: string;
  name: string;
  type: string;
  captain: string;
}

interface Docking {
  id: string;
  spacecraftId: string;
  dockingTime: string;
  bayId: number;
  status: 'scheduled' | 'docked' | 'departing';
}

interface Notification {
  id: string;
  message: string;
  timestamp: string;
}

// Prepare insert statements
const insertSpacecraft = db.prepare(`
  INSERT INTO spacecraft (id, name, type, captain) VALUES (?, ?, ?, ?)
`);

const insertDocking = db.prepare(`
  INSERT INTO docking (id, spacecraftId, dockingTime, bayId, status) VALUES (?, ?, ?, ?, ?)
`);

const insertNotification = db.prepare(`
  INSERT INTO notification (id, message, timestamp) VALUES (?, ?, ?)
`);

// Seed Spacecraft
const spacecrafts: Spacecraft[] = Array.from(
  { length: 6 },
  () => ({
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
    type: faker.helpers.arrayElement([
      'Cargo',
      'Passenger',
      'Research',
      'Military',
    ]),
    captain: faker.person.fullName(),
  })
);

const insertManySpacecraft = db.transaction(
  (spacecrafts: Spacecraft[]) => {
    for (const s of spacecrafts)
      insertSpacecraft.run(s.id, s.name, s.type, s.captain);
  }
);

insertManySpacecraft(spacecrafts);

// Seed Dockings
const dockings: Docking[] = spacecrafts
  .slice(0, 4)
  .map((s) => ({
    id: faker.string.uuid(),
    spacecraftId: s.id,
    dockingTime: faker.date.recent().toISOString(),
    bayId: faker.number.int({ min: 1, max: 10 }),
    status: faker.helpers.arrayElement([
      'scheduled',
      'docked',
      'departing',
    ]),
  }));

const insertManyDockings = db.transaction(
  (dockings: Docking[]) => {
    for (const d of dockings)
      insertDocking.run(
        d.id,
        d.spacecraftId,
        d.dockingTime,
        d.bayId,
        d.status
      );
  }
);

insertManyDockings(dockings);

// Seed Notifications
const notifications: Notification[] = Array.from(
  { length: 12 },
  () => ({
    id: faker.string.uuid(),
    message: faker.helpers.arrayElement([
      'Docking scheduled',
      'Docking completed',
      'Docking cancelled',
      'Emergency docking procedure initiated',
      'Spacecraft departed',
      'Docking bay maintenance',
    ]),
    timestamp: faker.date.recent().toISOString(),
  })
);

const insertManyNotifications = db.transaction(
  (notifications: Notification[]) => {
    for (const n of notifications)
      insertNotification.run(n.id, n.message, n.timestamp);
  }
);

insertManyNotifications(notifications);
