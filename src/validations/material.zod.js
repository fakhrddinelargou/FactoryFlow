const { z } = require('zod');

const createMaterialSchema = z
  .object({
    reference: z
      .string({ required_error: 'La référence est requise' })
      .trim()
      .toUpperCase()
      .min(1, 'La référence est requise'),

    name: z
      .string({ required_error: 'Le nom est requis' })
      .trim()
      .min(3, 'Le nom doit contenir au moins 2 caractères'),

    unit: z
      .string({ required_error: "L'unité est requise" })
      .trim()
      .min(1, "L'unité est requise"),

    availableQuantity: z
      .number({ invalid_type_error: 'La quantité doit être un nombre' })
      .min(0, 'La quantité ne peut pas être négative')
      .default(0),

    alertThreshold: z
      .number({ invalid_type_error: 'Le seuil doit être un nombre' })
      .min(0, 'Le seuil ne peut pas être négatif')
      .default(0),
  }).strict();

const updateMaterialSchema = z
  .object({
    reference: z.string().trim().toUpperCase().min(1, 'Référence invalide').optional(),
    name: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
    unit: z.string().trim().min(1, 'Unité invalide').optional(),
    alertThreshold: z.number().min(0, 'Le seuil ne peut pas être négatif').optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Aucun champ à modifier',
  });



const stockEntrySchema = z
  .object({
    quantity: z
      .number({ required_error: 'La quantité est requise', invalid_type_error: 'La quantité doit être un nombre' })
      .positive('La quantité doit être supérieure à 0'),
  })
  .strict();

module.exports = { createMaterialSchema, updateMaterialSchema , stockEntrySchema };