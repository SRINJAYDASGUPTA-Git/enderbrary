import { z } from 'zod';

export const BookSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    author: z.string().min(1, 'Author is required'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    category: z.string().min(1, 'Category is required'),
    coverUrl: z.string().url('Cover URL must be a valid URL').optional().or(z.literal('')),
    imageFile: z
        .any()
        .optional()
        .refine(
            (file) => {
                if (!file || file.length === 0) return true;
                return file[0] instanceof File;
            },
            { message: 'Invalid image file' }
        ),
});

export type BookFormData = z.infer<typeof BookSchema>;
