import { z } from 'zod';

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

export type SignupInput = z.infer<typeof signupSchema>;
