import { beforeAll, afterAll, afterEach } from 'vitest';
import { server } from './mocks/server';
import { http, HttpResponse } from 'msw';
import type {
  DockingWithSpacecraft,
  Spacecraft,
} from '../src/types';

export function useMockServer() {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  return {
    useMockCreateSpacecraft : () => {
      server.use(
        http.post('/api/spacecrafts', async ({ request }) => {
            const { name, type, captain } = await request.json() as Omit<Spacecraft, 'id'>;
            return HttpResponse.json({
              id: 1,
              name,
              type,
              captain,
            });
        })
      )
    },
    useMockDockings: (
      mockDockings: DockingWithSpacecraft[]
    ) => {
      server.use(
        http.get('/api/dockings', () => {
          return HttpResponse.json(mockDockings);
        })
      );
    },

    useErrorFetchingDockings: () => {
      server.use(
        http.get('/api/dockings', () => {
          return HttpResponse.error();
        })
      );
    },
    useMockSpacecrafts: (mockSpacecrafts: Spacecraft[]) => {
      server.use(
        http.get('/api/spacecrafts', () => {
          return HttpResponse.json(mockSpacecrafts);
        })
      );
    },
    useErrorFetchingSpacecrafts: () => {
      server.use(
        http.get('/api/spacecrafts', () => {
          return HttpResponse.error();
        })
      );
    },
  };
}
