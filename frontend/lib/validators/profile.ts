// lib/validators/profile.ts
import { z } from 'zod';

export const profileSettingsSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    email: z.string().email('Invalid email format').optional(),
    imageFile: z
        .any()
        .optional()
        .refine((file) => !file || file instanceof FileList, { message: 'Invalid file type' }),
});

export type ProfileSettingsValues = z.infer<typeof profileSettingsSchema>;
