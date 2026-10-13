const { z } = require('zod');
const mongoose = require('mongoose');
const Product = require('../models/Product')
const compositionItemSchema = z.object({
  material: z
    .string({ required_error: 'La matière est requise' })
    .refine((v) => mongoose.isValidObjectId(v), { message: 'Identifiant de matière invalide' }),

  quantity: z
    .number({ required_error: 'La quantité est requise', invalid_type_error: 'La quantité doit être un nombre' })
    .positive('La quantité doit être supérieure à 0'),
}).strict();

const createProductSchema = z.object({
  reference: z
    .string({ required_error: 'La référence est requise' })
    .trim()
    .toUpperCase()
    .min(1, 'La référence est requise'),

  name: z
    .string({ required_error: 'Le nom est requis' })
    .trim()
    .min(2, 'Le nom doit contenir au moins 2 caractères'),

  composition: z
    .array(compositionItemSchema, { required_error: 'La composition est requise' })
    .min(1, 'La composition doit contenir au moins une matière')
    .superRefine((items, ctx) => {
      const seen = new Set();
      items.forEach((item, index) => {
        if (seen.has(item.material)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Matière en double: ${item.material}`,
            path: [index, 'material'],
          });
        }
        seen.add(item.material);
      });
    }),
}).strict();

const compositionSchema = z
  .array(compositionItemSchema, { required_error: 'La composition est requise' })
  .min(1, 'La composition doit contenir au moins une matière')
  .superRefine((items, ctx) => {
    const seen = new Set();
    items.forEach((item, index) => {
      if (seen.has(item.material)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Matière en double: ${item.material}`,
          path: [index, 'material'],
        });
      }
      seen.add(item.material);
    });
  });
  
const updateProductSchema = z.object({
  reference: z
    .string({ required_error: 'La référence est requise' })
    .trim()
    .toUpperCase()
    .min(1, 'La référence est requise').optional(),
  name: z
    .string({ required_error: 'Le nom est requis' })
    .trim()
    .min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
  composition: compositionSchema.optional(),
})
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Aucun champ à modifier',
  });

module.exports = { createProductSchema, updateProductSchema };