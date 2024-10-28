// app.ts
import {
  createApp,
  createRouter,
  defineEventHandler,
  toNodeListener,
  handleCors,
} from 'h3';
import { createServer } from 'node:http';
import {
  getSpacecrafts,
  getSpacecraft,
  createSpacecraft,
  updateSpacecraft,
} from './routes/spacecraft';
import {
  getDockings,
  getDocking,
  createDocking,
} from './routes/docking';
import { getNotifications } from './routes/notifications';
import './seed'; // Ensure the database is seeded on server start

const app = createApp();

// Create a router for spacecrafts
const spacecraftRouter = createRouter()
  .get('/api/spacecrafts', getSpacecrafts)
  .get('/api/spacecrafts/:id', getSpacecraft)
  .post('/api/spacecrafts', createSpacecraft)
  .put('/api/spacecrafts/:id', updateSpacecraft);

// Create a router for dockings
const dockingRouter = createRouter()
  .get('/api/dockings', getDockings)
  .get('/api/dockings/:id', getDocking)
  .post('/api/dockings', createDocking);

// Create a router for notifications
const notificationRouter = createRouter().get(
  '/api/notifications',
  getNotifications
);

app.use(
  defineEventHandler((event) => {
    console.log(
      `${event.node.req.method} ${event.node.req.url}`
    );
  })
);

app.use(
  defineEventHandler((event) => {
    const didHandleCors = handleCors(event, {
      origin: '*',
      methods: '*',
      preflight: {
        statusCode: 204,
      },
    });
    if (didHandleCors) {
      return;
    }
  })
);

app.use(spacecraftRouter);
app.use(dockingRouter);
app.use(notificationRouter);

// Optionally, add a default route or error handling here
app.use(
  defineEventHandler((event) => {
    event.node.res.statusCode = 404;
    return { error: 'Endpoint not found' };
  })
);

const server = createServer(toNodeListener(app));

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
