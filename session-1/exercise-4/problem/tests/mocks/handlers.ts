import { factory, primaryKey, oneOf } from '@mswjs/data';
import { faker } from '@faker-js/faker';
import { http, HttpResponse } from 'msw';

faker.seed(1030);

const API_BASE = '/api';

// Define the database schema
const db = factory({
  spacecraft: {
    id: primaryKey(faker.string.uuid),
    name: () =>
      `${faker.helpers.arrayElement([
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
    type: () =>
      faker.helpers.arrayElement([
        'Cargo',
        'Passenger',
        'Research',
        'Military',
      ]),
    captain: faker.person.fullName,
  },
  docking: {
    id: primaryKey(faker.string.uuid),
    spacecraftId: oneOf('spacecraft').attributes.id,
    dockingTime: () => faker.date.recent().toISOString(),
    bayId: () => faker.number.int({ min: 1, max: 10 }),
    status: () =>
      faker.helpers.arrayElement([
        'scheduled',
        'docked',
        'departing',
      ]),
  },
  notification: {
    id: primaryKey(faker.string.uuid),
    message: () =>
      faker.helpers.arrayElement([
        'Docking scheduled',
        'Docking completed',
        'Docking cancelled',
        'Emergency docking procedure initiated',
        'Spacecraft departed',
        'Docking bay maintenance',
      ]),
    timestamp: () => faker.date.recent().toISOString(),
  },
});

function getSpacecraftWithNoDocking() {
  const spacecraft = db.spacecraft.getAll();
  const dockings = db.docking.getAll();

  return spacecraft.filter((spacecraft) => {
    return !dockings.some(
      (docking) => docking.spacecraftId === spacecraft.id // Corrected property access
    );
  });
}

// Create spacecraft
Array.from({ length: 6 }).forEach(() => {
  db.spacecraft.create();
});

// Create some departing dockings
Array.from({ length: 2 }).forEach(() => {
  const spacecraft = getSpacecraftWithNoDocking();
  db.docking.create({
    spacecraftId: faker.helpers.arrayElement(spacecraft).id,
    dockingTime: faker.date.past().toISOString(),
    status: 'departing',
  });
});

// Create some docked dockings
Array.from({ length: 2 }).forEach(() => {
  const spacecraft = getSpacecraftWithNoDocking();
  db.docking.create({
    spacecraftId: faker.helpers.arrayElement(spacecraft).id,
    dockingTime: faker.date.recent().toISOString(),
    status: 'docked',
  });
});

// Create some scheduled dockings
Array.from({ length: 2 }).forEach(() => {
  const spacecraft = getSpacecraftWithNoDocking();
  db.docking.create({
    spacecraftId: faker.helpers.arrayElement(spacecraft).id,
    dockingTime: faker.date.soon().toISOString(),
    status: 'scheduled',
  });
});

// Create notifications
Array.from({ length: 12 }).forEach(() => {
  db.notification.create();
});

export const handlers = [
  http.post(`${API_BASE}/dockings`, async ({ request }) => {
    const body = await request.json();
    if (
      !body ||
      typeof body !== 'object' ||
      !('spacecraftId' in body)
    ) {
      return new HttpResponse(null, {
        status: 400,
        statusText: 'Invalid request body',
      });
    }

    const spacecraftId = body.spacecraftId;
    const spacecraft = db.spacecraft.findFirst({
      where: { id: { equals: spacecraftId } },
    });

    if (!spacecraft) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Spacecraft not found',
      });
    }

    const newDocking = db.docking.create({
      ...body,
      spacecraftId: spacecraft.id,
      status: 'scheduled', // Ensure the status is set to 'scheduled'
    });

    return HttpResponse.json(newDocking, { status: 201 });
  }),

  ...db.spacecraft.toHandlers('rest', API_BASE),
  ...db.docking.toHandlers('rest', API_BASE),
  ...db.notification.toHandlers('rest', API_BASE),
];
