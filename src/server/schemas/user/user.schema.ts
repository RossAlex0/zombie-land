import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Adresse email invalide'),
  password: z.string().min(12, 'Le mot de passe doit contenir au moins 12 caractères'),
});

export const signupSchema = z
  .object({
    first_name: z.string().min(3, 'Le prénom doit contenir au moins 3 caractères'),
    last_name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),

    email: z.email('Adresse email invalide'),
    password: z.string().min(12, 'Le mot de passe doit contenir au moins 12 caractères'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

export const updateUserSchema = z.object({
  first_name: z.string().min(3).optional(),
  last_name: z.string().min(3).optional(),
  birth_date: z.coerce.date().optional(),
});

export const updatePasswordSchema = z
  .object({
    oldPassword: z.string().min(12),
    password: z.string().min(12),
    confirmPassword: z.string().min(12),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les nouveaux mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });
export type SignupInput = z.infer<typeof signupSchema>;
