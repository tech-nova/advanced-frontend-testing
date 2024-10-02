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
    // Step 1
  }),

  http.get(`${API_BASE}/spacecrafts/:id`, () => {
    // Step 2
  }),

  http.post(`${API_BASE}/spacecrafts`, () => {
    // Step 3
  }),

  http.put(`${API_BASE}/spacecrafts/:id`, () => {
    // Step 4
  }),
];

const dockingHandlers = [
  http.get(`${API_BASE}/dockings`, () => {
    // Step 1
  }),

  http.get(`${API_BASE}/dockings/:id`, () => {
    // Step 2
  }),

  http.post(`${API_BASE}/dockings`, () => {
    // Step 3
  }),
];

const notificationHandlers = [
  http.get(`${API_BASE}/notifications`, () => {
    // Step 1
  }),
];

export const handlers = [
  ...spacecraftHandlers,
  ...dockingHandlers,
  ...notificationHandlers,
];
