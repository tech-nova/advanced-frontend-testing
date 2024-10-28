// routes/docking.ts
import type { H3Event } from 'h3';
import db from '../database';
import { z } from 'zod';
import {
  defineEventHandler,
  readBody,
  createError,
  setResponseStatus,
} from 'h3';
import { faker } from '@faker-js/faker';

// Define the Docking schema using Zod for validation
const dockingSchema = z.object({
  id: z.string().uuid(),
  spacecraftId: z.string().uuid(),
  dockingTime: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
  bayId: z.number().int().positive(),
  status: z.enum(['scheduled', 'docked', 'departing']),
});

// Helper function to retrieve a docking by ID
const getDockingById = (id: string) => {
  return db
    .prepare('SELECT * FROM docking WHERE id = ?')
    .get(id);
};

// Handler to get all dockings
export const getDockings = defineEventHandler(() => {
  return db.prepare('SELECT * FROM docking').all();
});

// Handler to get a docking by ID
export const getDocking = defineEventHandler(
  (event: H3Event) => {
    const { id } = event.context.params || {};
    const docking = getDockingById(id);
    if (docking) {
      return docking;
    } else {
      throw createError({
        statusCode: 404,
        message: 'Docking not found',
      });
    }
  }
);

// Handler to create a new docking
export const createDocking = defineEventHandler(
  async (event: H3Event) => {
    const body = await readBody(event);
    const parsed = dockingSchema
      .omit({ id: true, status: true })
      .safeParse(body);
    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        data: parsed.error.errors,
      });
    }

    // Check if spacecraft exists
    const spacecraft = db
      .prepare('SELECT * FROM spacecraft WHERE id = ?')
      .get(parsed.data.spacecraftId);
    if (!spacecraft) {
      throw createError({
        statusCode: 404,
        message: 'Spacecraft not found',
      });
    }

    const newDocking = {
      ...parsed.data,
      id: faker.string.uuid(),
      status: 'scheduled',
    };

    db.prepare(
      'INSERT INTO docking (id, spacecraftId, dockingTime, bayId, status) VALUES (?, ?, ?, ?, ?)'
    ).run(
      newDocking.id,
      newDocking.spacecraftId,
      newDocking.dockingTime,
      newDocking.bayId,
      newDocking.status
    );

    setResponseStatus(event, 201);
    return newDocking;
  }
);
