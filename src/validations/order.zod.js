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

module.exports = { createOrderSchema };