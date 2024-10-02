import { beforeAll, afterAll, afterEach } from 'vitest';
import { server } from './mocks/server';
import { http, HttpResponse } from 'msw';

export function useMockServer() {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  return {
    useMockDockings: (mockDockings) => {
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
  };
}
