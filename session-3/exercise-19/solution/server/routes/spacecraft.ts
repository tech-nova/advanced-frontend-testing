// routes/spacecraft.ts
import type { H3Event } from 'h3';
import db from '../database';
import { z } from 'zod';
import {
  defineEventHandler,
  readBody,
  createError,
} from 'h3';
import { faker } from '@faker-js/faker';

// Define the Spacecraft schema using Zod for validation
const spacecraftSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  type: z.enum([
    'Cargo',
    'Passenger',
    'Research',
    'Military',
  ]),
  captain: z.string().min(1),
});

// Helper function to retrieve a spacecraft by ID
const getSpacecraftById = (id: string) => {
  return db
    .prepare('SELECT * FROM spacecraft WHERE id = ?')
    .get(id);
};

// Handler to get all spacecrafts
export const getSpacecrafts = defineEventHandler(
  (event: H3Event) => {
    const spacecrafts = db
      .prepare('SELECT * FROM spacecraft')
      .all();

    return spacecrafts;
  }
);

// Handler to get a spacecraft by ID
export const getSpacecraft = defineEventHandler(
  (event: H3Event) => {
    const { id } = event.context.params || {};
    const spacecraft = getSpacecraftById(id);
    if (!spacecraft) {
      throw createError({
        statusCode: 404,
        message: 'Spacecraft not found',
      });
    }
    return spacecraft;
  }
);

// Handler to create a new spacecraft
export const createSpacecraft = defineEventHandler(
  async (event: H3Event) => {
    const body = await readBody(event);
    const parsed = spacecraftSchema
      .omit({ id: true })
      .safeParse(body);
    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        message: 'Invalid spacecraft data',
        data: parsed.error.errors,
      });
    }

    const newSpacecraft = {
      id: faker.string.uuid(),
      ...parsed.data,
    };

    db.prepare(
      'INSERT INTO spacecraft (id, name, type, captain) VALUES (?, ?, ?, ?)'
    ).run(
      newSpacecraft.id,
      newSpacecraft.name,
      newSpacecraft.type,
      newSpacecraft.captain
    );

    event.node.res.statusCode = 201;
    return newSpacecraft;
  }
);

// Handler to update an existing spacecraft
export const updateSpacecraft = defineEventHandler(
  async (event: H3Event) => {
    const { id } = event.context.params || {};
    const body = await readBody(event);

    const existing = getSpacecraftById(id);
    if (!existing) {
      throw createError({
        statusCode: 404,
        message: 'Spacecraft not found',
      });
    }

    const parsed = spacecraftSchema
      .partial()
      .safeParse(body);
    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        message: 'Invalid update data',
        data: parsed.error.errors,
      });
    }

    const updatedSpacecraft = {
      ...existing,
      ...parsed.data,
    };
    const validated = spacecraftSchema.safeParse(
      updatedSpacecraft
    );
    if (!validated.success) {
      throw createError({
        statusCode: 400,
        message: 'Invalid spacecraft data after update',
        data: validated.error.errors,
      });
    }

    db.prepare(
      'UPDATE spacecraft SET name = ?, type = ?, captain = ? WHERE id = ?'
    ).run(
      validated.data.name,
      validated.data.type,
      validated.data.captain,
      id
    );

    return validated.data;
  }
);
