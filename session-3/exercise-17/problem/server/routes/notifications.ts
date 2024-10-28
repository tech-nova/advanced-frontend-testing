// routes/notifications.ts
import { H3Event } from 'h3';
import db from '../database';
import { defineEventHandler } from 'h3';

// Handler to get all notifications
export const getNotifications = defineEventHandler(
  (event: H3Event) => {
    const notifications = db
      .prepare('SELECT * FROM notification')
      .all();
    return notifications;
  }
);
