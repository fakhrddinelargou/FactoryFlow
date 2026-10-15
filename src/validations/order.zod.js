const { z } = require('zod');
const mongoose = require('mongoose');

const objectId = (label) =>
  z
    .string({ required_error: `${label} est requis` })
    .refine((v) => mongoose.isValidObjectId(v), { message: `${label} invalide` });

const createOrderSchema = z
  .object({
    product: objectId('Le produit'),

    quantity: z
      .number({ required_error: 'La quantité est requise', invalid_type_error: 'La quantité doit être un nombre' })
      .int('La quantité doit être un entier')
      .positive('La quantité doit être supérieure à 0'),

    assignedTo: objectId("L'opérateur"),
  })
  .strict();

  const updateOrderSchema = z
  .object({
    quantity: z
      .number({ invalid_type_error: 'La quantité doit être un nombre' })
      .int('La quantité doit être un entier')
      .positive('La quantité doit être supérieure à 0')
      .optional(),

    assignedTo: objectId("L'opérateur").optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Aucun champ à modifier',
  });


  
  const isoDate = (label) =>
  z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), { message: `${label} doit être une date ISO valide` })
    .transform((v) => new Date(v));

const listOrdersQuerySchema = z
  .object({
    status: z
      .enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED'], { message: 'Statut invalide' })
      .optional(),

    product: z
      .string()
      .refine((v) => mongoose.isValidObjectId(v), { message: 'Produit invalide' })
      .optional(),

    from: isoDate('from').optional(),
    to: isoDate('to').optional(),

    page: z.coerce
      .number({ invalid_type_error: 'page doit être un nombre' })
      .int('page doit être un entier')
      .min(1, 'page doit être >= 1')
      .default(1),

    limit: z.coerce
      .number({ invalid_type_error: 'limit doit être un nombre' })
      .int('limit doit être un entier')
      .min(1, 'limit doit être >= 1')
      .max(100, 'limit doit être <= 100')
      .default(10),
  })
  .strict()
  .refine((q) => !q.from || !q.to || q.from <= q.to, {
    message: 'from doit être inférieur ou égal à to',
    path: ['from'],
  });

  const getMineWithStatus = z.object({
        status: z
      .enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED'], { message: 'Statut invalide' })
      .optional()
  })
module.exports = { createOrderSchema, updateOrderSchema, listOrdersQuerySchema , getMineWithStatus };
