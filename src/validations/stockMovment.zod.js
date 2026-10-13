const { z } = require('zod');
const mongoose = require('mongoose');

const listMovementsQuerySchema = z
  .object({
    material: z
      .string()
      .refine((v) => mongoose.isValidObjectId(v), { message: 'Matière invalide' })
      .optional(),

    type: z
      .enum(['IN', 'OUT'], { message: 'Type invalide (IN ou OUT)' })
      .optional(),

    page: z.coerce
      .number({ invalid_type_error: 'page doit être un nombre' })
      .int('page doit être un entier')
      .min(1, 'page doit être >= 1')
      .default(1),

    limit: z.coerce
      .number({ invalid_type_error: 'limit doit être un nombre' })
      .int('limit doit être un entier')
      .min(1, 'limit doit être >= 1')
      .max(100, 'limit max 100')
      .default(10),
  })
  .strict();

module.exports = { listMovementsQuerySchema };