'use client';

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {BookSchema, BookFormData} from '@/lib/validators/book';
import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import ImageUpload from '@/components/ImageUpload';
import {toast} from 'sonner';
import axios from '@/utils/axiosInstance';
import {useRouter} from 'next/navigation';
import {uploadToImgbb} from '@/lib/utils';
import {useState} from 'react';
import {useUser} from '@/providers/UserContext';
import Loader from '@/components/Loader';

export default function AddBookPage() {
    const router = useRouter();
    const {user, loading: userLoading} = useUser();
    const [submitting, setSubmitting] = useState(false);

    if (!user && !userLoading) {
        toast.error('You must be logged in to add a book');
        window.location.replace('/login');
    }

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

    const onSubmit = async (data: BookFormData) => {
        setSubmitting(true);
        try {
            let finalCoverUrl = data.coverUrl;
            if (data.imageFile && data.imageFile.length > 0) {
                finalCoverUrl = await uploadToImgbb(data.imageFile[0]);
            }

            await axios.post('/api/v1/books', {
                title: data.title,
                author: data.author,
                description: data.description,
                category: data.category,
                coverUrl: finalCoverUrl,
            });

            toast.success('Book added!');
            router.push('/books/me');
        } catch (err) {
            toast.error('Failed to add book');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-purple-50 flex justify-center px-4 py-10 sm:px-8">
            <div className="max-w-3xl w-full bg-white shadow-md rounded-xl p-6 space-y-6">
                <h1 className="text-2xl font-display font-semibold text-purple-800">Add a New Book</h1>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Book title"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="author"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Author</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Author name"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({field}) => {
                                const charCount = field.value?.length || 0;
                                return (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Textarea
                                                    {...field}
                                                    maxLength={250}
                                                    placeholder="A short summary..."
                                                    className="pr-16"
                                                />
                                                <span className="absolute bottom-2 right-2 text-xs text-gray-400">
              {charCount}/250
            </span>
                                            </div>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                );
                            }}
                        />


                        <FormField
                            control={form.control}
                            name="category"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Genre or category"/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="imageFile"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Cover Image</FormLabel>
                                    <FormControl>
                                        <ImageUpload
                                            onChange={(file) => field.onChange(file ? [file] : undefined)}
                                            previewUrl={form.watch('coverUrl')}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-display"
                        >
                            {submitting ? 'Adding Book...' : 'Add Book'}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
