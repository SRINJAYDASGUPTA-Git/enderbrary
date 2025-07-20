'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { BookSchema, BookFormData } from '@/lib/validators/book';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/ImageUpload';
import { toast } from 'sonner';
import axios from '@/utils/axiosInstance';
import { useParams, useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import { uploadToImgbb } from '@/lib/utils';

export default function EditBookPage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const form = useForm<BookFormData>({
        resolver: zodResolver(BookSchema),
        defaultValues: {
            title: '',
            author: '',
            description: '',
            category: '',
            coverUrl: '',
            imageFile: undefined,
        },
    });

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await axios.get(`/api/v1/books/${id}`);
                const book = res.data;

                form.reset({
                    title: book.title,
                    author: book.author,
                    description: book.description,
                    category: book.category,
                    coverUrl: book.coverUrl,
                    imageFile: undefined,
                });
            } catch (err) {
                toast.error('Failed to fetch book data');
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id, form]);

    const onSubmit = async (data: BookFormData) => {
        setSubmitting(true);
        try {
            let finalCoverUrl = data.coverUrl;
            if (data.imageFile && data.imageFile.length > 0) {
                finalCoverUrl = await uploadToImgbb(data.imageFile[0]);
            }

            await axios.put(`/api/v1/books/${id}`, {
                title: data.title,
                author: data.author,
                description: data.description,
                category: data.category,
                coverUrl: finalCoverUrl,
            });

            toast.success('Book updated');
            router.push(`/books/${id}`);
        } catch (err) {
            toast.error('Update failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Loader subtitle="Loading book data..." />;
    }

    return (
        <div className="max-w-3xl mx-auto mt-20 p-6 bg-white shadow-md rounded-xl space-y-6">
            <h1 className="text-2xl font-display font-semibold text-purple-800">Edit Book</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Book title" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Author</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Author name" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder="A short summary..." />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Genre or category" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* 👇 Drag and drop image upload */}
                    <FormField
                        control={form.control}
                        name="imageFile"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cover Image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        onChange={(file) => field.onChange(file ? [file] : undefined)}
                                        previewUrl={form.watch('coverUrl')}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-display"
                    >
                        {submitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
