import { faker } from '@faker-js/faker';
import { http, HttpResponse } from 'msw';

faker.seed(1030);

const API_BASE = '/api';

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

const generateSpacecraft = (): Spacecraft => ({
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
});

const generateDocking = (
  spacecraftId: string
): Docking => ({
  id: faker.string.uuid(),
  spacecraftId,
  dockingTime: faker.date.recent().toISOString(),
  bayId: faker.number.int({ min: 1, max: 10 }),
  status: faker.helpers.arrayElement([
    'scheduled',
    'docked',
    'departing',
  ]),
});

const generateNotification = (): Notification => ({
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
});

let spacecraft: Spacecraft[] = Array.from(
  { length: 6 },
  generateSpacecraft
);
let dockings: Docking[] = spacecraft
  .slice(0, 4)
  .map((s) => generateDocking(s.id));
let notifications: Notification[] = Array.from(
  { length: 12 },
  generateNotification
);

const spacecraftHandlers = [
  http.get(`${API_BASE}/spacecrafts`, () => {
    return HttpResponse.json(spacecraft);
  }),

  http.get(`${API_BASE}/spacecrafts/:id`, ({ params }) => {
    const { id } = params;
    const found = spacecraft.find((s) => s.id === id);
    return found
      ? HttpResponse.json(found)
      : new HttpResponse(null, { status: 404 });
  }),

  http.post(
    `${API_BASE}/spacecrafts`,
    async ({ request }) => {
      const body = await request.json();
      if (!body || typeof body !== 'object') {
        return new HttpResponse(null, {
          status: 400,
          statusText: 'Invalid request body',
        });
      }

      const newSpacecraft: Spacecraft = {
        ...body,
        id: faker.string.uuid(),
      };

      spacecraft.push(newSpacecraft);
      return HttpResponse.json(newSpacecraft, {
        status: 201,
      });
    }
  ),

  http.put(
    `${API_BASE}/spacecrafts/:id`,
    async ({ params, request }) => {
      const { id } = params;
      const body = await request.json();
      const found = spacecraft.find((s) => s.id === id);
      if (found) {
        const updatedSpacecraft = { ...found, ...body };
        spacecraft = spacecraft.map((s) =>
          s.id === id ? updatedSpacecraft : s
        );
        return HttpResponse.json(updatedSpacecraft);
      }
      return new HttpResponse(null, { status: 404 });
    }
  ),
];

const dockingHandlers = [
  http.get(`${API_BASE}/dockings`, () => {
    return HttpResponse.json(dockings);
  }),

  http.get(`${API_BASE}/dockings/:id`, ({ params }) => {
    const { id } = params;
    const found = dockings.find((d) => d.id === id);
    return found
      ? HttpResponse.json(found)
      : new HttpResponse(null, { status: 404 });
  }),

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
    const foundSpacecraft = spacecraft.find(
      (s) => s.id === spacecraftId
    );

    if (!foundSpacecraft) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Spacecraft not found',
      });
    }

    const newDocking: Docking = {
      ...body,
      id: faker.string.uuid(),
      spacecraftId: foundSpacecraft.id,
      status: 'scheduled',
      dockingTime: faker.date.soon().toISOString(),
      bayId: faker.number.int({ min: 1, max: 10 }),
    };

    dockings.push(newDocking);
    return HttpResponse.json(newDocking, { status: 201 });
  }),
];

const notificationHandlers = [
  http.get(`${API_BASE}/notifications`, () => {
    return HttpResponse.json(notifications);
  }),
];

export const handlers = [
  ...spacecraftHandlers,
  ...dockingHandlers,
  ...notificationHandlers,
];
