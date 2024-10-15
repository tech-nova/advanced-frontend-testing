import { beforeAll, afterAll, afterEach } from 'vitest';
import { server } from './mocks/server';
import { http, HttpResponse } from 'msw';
import type {
  DockingWithSpacecraft,
  Spacecraft,
} from '@/types';

export function useMockServer() {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  return {
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
