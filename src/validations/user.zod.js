const { z } = require('zod');

const userSchema = z.object({
  first_name: z
    .string({ required_error: 'Le prénom est requis' })
    .trim()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom est trop long'),

  last_name: z
    .string({ required_error: 'Le nom est requis' })
    .trim()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom est trop long'),

  email: z
    .string({ required_error: "L'email est requis" })
    .trim()
    .toLowerCase()
    .email('Email invalide'),

  password: z
    .string({ required_error: 'Le mot de passe est requis' })
    .min(8, 'Au moins 8 caractères')
    .regex(/[A-Z]/, 'Au moins une majuscule')
    .regex(/[a-z]/, 'Au moins une minuscule')
    .regex(/[0-9]/, 'Au moins un chiffre')
    .regex(/[^A-Za-z0-9]/, 'Au moins un caractère spécial'),
});


const loginSchema = z.object({
  email: z
    .string({ required_error: "L'email est requis" })
    .trim()
    .toLowerCase()
    .email('Email invalide'),

  password: z
    .string({ required_error: 'Le mot de passe est requis' })
    .min(1, 'Le mot de passe est requis'),
});


module.exports = { userSchema ,  loginSchema };