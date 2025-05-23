import { http, HttpResponse } from 'msw';
import {
  spacecraftData,
  departingDockings,
  dockedDockings,
  scheduledDockings,
  notificationData,
} from './utils/mockData';

const API_BASE = '/api';

let spacecraft = [...spacecraftData];
let dockings = [
  ...departingDockings,
  ...dockedDockings,
  ...scheduledDockings,
];
let notifications = [...notificationData];

const spacecraftHandlers = [
  http.get(`${API_BASE}/spacecrafts`, () => {
    return HttpResponse.json(spacecraft);
  }),

  http.get(`${API_BASE}/spacecrafts/:id`, ({ params }) => {
    const id = params.id;
    const found = spacecraft.find((sc) => sc.id === id);
    return found
      ? HttpResponse.json(found)
      : new HttpResponse(null, { status: 404 });
  }),

  http.post(`${API_BASE}/spacecrafts`, async ({ request }) => {
    const body = await request.json();
    if (
      !body ||
      typeof body !== 'object' ||
      !('name' in body) ||
      !('type' in body) ||
      !('captain' in body)
    ) {
      return new HttpResponse(null, {
        status: 400,
        statusText: 'Invalid request body',
      });
    }

    const newSpacecraft = {
      id: String(spacecraft.length + 1),
      name: body.name,
      type: body.type,
      captain: body.captain,
    };

    spacecraft.push(newSpacecraft);
    return HttpResponse.json(newSpacecraft, { status: 201 });
  }),

  http.put(
    `${API_BASE}/spacecrafts/:id`,
    async ({ params, request }) => {
      const { id } = params;
      const body = await request.json() as Partial<typeof spacecraft> ;
      const found = spacecraft.find((s) => s.id === id);
      if (found) {
        const updatedSpacecraft: typeof found = { ...found, ...body };
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
    const id = params.id;
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
  
    const newDocking = {
      bayId: 1,
      dockingTime: new Date().toISOString(),
      ...body,
      id: String(dockings.length + 1),
      spacecraftId: foundSpacecraft.id,
      status: 'scheduled',
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
