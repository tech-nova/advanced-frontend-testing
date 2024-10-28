/**
 * This apiService object provides a centralized interface for making API calls
 * to various endpoints related to spacecraft, dockings, and notifications.
 *
 * Key features:
 * - Uses the $fetch function from 'ofetch' for making HTTP requests
 * - Implements RESTful API patterns (GET, POST, PUT)
 *
 * Note: Error handling is not implemented in these methods. It's recommended
 * to add try-catch blocks or use .catch() when calling these methods to handle
 * potential network errors or API response errors.
 *
 * Usage example with try-catch:
 * try {
 *   const spacecrafts = await apiService.getSpacecraft();
 * } catch (error) {
 *   console.error('Error fetching spacecrafts:', error);
 * }
 */

import { $fetch } from 'ofetch';
import type {
  Spacecraft,
  Docking,
  Notification,
} from '@/types';

// Base URL for all API endpoints
const API_BASE = `${
  process.env.NODE_ENV === 'e2e'
    ? 'http://localhost:3000'
    : window.location.origin
}/api`;

// API service object containing methods for interacting with various endpoints
export const apiService = {
  // Spacecraft-related API methods
  getSpacecraft: (): Promise<Spacecraft[]> =>
    $fetch(`${API_BASE}/spacecrafts`),
  addSpacecraft: (
    data: Omit<Spacecraft, 'id'>
  ): Promise<Spacecraft> =>
    $fetch(`${API_BASE}/spacecrafts`, {
      method: 'POST',
      body: data,
    }),
  updateSpacecraft: (
    id: string,
    data: Partial<Omit<Spacecraft, 'id'>>
  ): Promise<Spacecraft> =>
    $fetch(`${API_BASE}/spacecrafts/${id}`, {
      method: 'PUT',
      body: data,
    }),

  // Docking-related API methods
  getDockings: (): Promise<Docking[]> =>
    $fetch(`${API_BASE}/dockings`),
  scheduleDocking: (
    data: Omit<Docking, 'id'>
  ): Promise<Docking> =>
    $fetch(`${API_BASE}/dockings`, {
      method: 'POST',
      body: data,
    }),
  updateDocking: (
    id: string,
    data: Partial<Omit<Docking, 'id'>>
  ): Promise<Docking> =>
    $fetch(`${API_BASE}/dockings/${id}`, {
      method: 'PUT',
      body: data,
    }),

  // Notification-related API methods
  getNotifications: (): Promise<Notification[]> =>
    $fetch(`${API_BASE}/notifications`),
  sendNotification: (
    data: Omit<Notification, 'id' | 'timestamp'>
  ): Promise<Notification> =>
    $fetch(`${API_BASE}/notifications`, {
      method: 'POST',
      body: data,
    }),
};
