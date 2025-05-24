import { faker } from '@faker-js/faker';
import { http, HttpResponse } from 'msw';

const API_BASE = '/api';

// 👇 7. Set a seed value here for FakerJS.

/**
 * Use the types to help you generate the random data
 */
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

// 👇 1. Create a `generateNotification` function
// const generateNotification = (): Notification => ({});
const generateNotification = (): Notification => ({
  id: faker.string.uuid(),
  message: faker.lorem.sentence(),
  timestamp: faker.date.recent().toISOString(),
});

// 👇 3. Create a `generateSpacecraft` function
// const generateSpacecraft = (): Spacecraft => ({});
const generateSpacecraft = (): Spacecraft => ({
  id: faker.string.uuid(),
  name: faker.helpers.arrayElement([
    'Voyager',
    'Discovery',
    'Enterprise',
    'Falcon',
    'Orion',
  ]),
  type: faker.helpers.arrayElement([
    'Shuttle',
    'Probe',
    'Station',
    'Lander',
  ]),
  captain: faker.person.fullName(),
});

// 👇 5. Create a `generateDocking` function
// const generateDocking = (
//   spacecraftId: string
// ): Docking => ({});
const generateDocking = (spacecraftId: string): Docking => ({
  id: faker.string.uuid(),
  spacecraftId,
  dockingTime: faker.date.soon().toISOString(),
  bayId: faker.number.int({ min: 1, max: 10 }),
  status: faker.helpers.arrayElement([
    'scheduled',
    'docked',
    'departing',
  ]),
});

let spacecraft: Spacecraft[] = [];
let dockings: Docking[] = [];
let notifications: Notification[] = [];

const spacecraftHandlers = [
  // 👇 4. Update the GET `/spacecrafts` handler to use the `generateSpacecraft` function.
  http.get(`${API_BASE}/spacecrafts`, () => {
    const generatedSpacecraft = Array.from({ length: 5 }, generateSpacecraft);
    return HttpResponse.json(generatedSpacecraft);
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
      const body = await request.json() as Omit<Spacecraft, 'id'>;
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
      const body = await request.json() as Omit<Spacecraft, 'id'>;
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

    const newDocking = generateDocking(foundSpacecraft.id);
    dockings.push(newDocking);
    return HttpResponse.json(newDocking, { status: 201 });
  }),
];

// 👇 2. Update the GET `/notifications` handler to use the `generateNotification` function.
const notificationHandlers = [
  http.get(`${API_BASE}/notifications`, () => {
    notifications = Array.from(
      { length: 5 },
      generateNotification
    );
    return HttpResponse.json(notifications);
  }),
];

export const handlers = [
  ...spacecraftHandlers,
  ...dockingHandlers,
  ...notificationHandlers,
];
