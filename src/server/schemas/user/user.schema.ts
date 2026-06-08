import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email().min(2),
  //!A changer pour au moins 12 avant le passage du TP
  password: z.string().min(6),
});

export const signupSchema = z
  .object({
    first_name: z.string().min(3),
    last_name: z.string().min(3),

    email: z.email().min(2),
    //!A changer pour au moins 12 avant le passage du TP
    password: z.string().min(6),
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
    //!A changer pour au moins 12 avant le passage du TP
    oldPassword: z.string().min(6),
    newPassword: z.string().min(6),
    newConfirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.newConfirmPassword, {
    message: 'Les nouveaux mots de passe ne correspondent pas',
    path: ['newConfirmPassword'],
  });
export type SignupInput = z.infer<typeof signupSchema>;
