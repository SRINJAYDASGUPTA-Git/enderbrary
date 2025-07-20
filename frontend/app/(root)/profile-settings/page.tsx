'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/providers/UserContext';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    profileSettingsSchema,
    ProfileSettingsValues,
} from '@/lib/validators/profile';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from '@/utils/axiosInstance';
import { uploadToImgbb } from '@/lib/utils';
import Image from 'next/image';
import { Image as ImageIcon, UploadCloud, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';

export default function ProfileSettingsPage() {
    const { user, refreshUser, loading: userLoading } = useUser();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<ProfileSettingsValues>({
        resolver: zodResolver(profileSettingsSchema),
        defaultValues: {
            name: '',
            imageUrl: '',
            imageFile: undefined,
        },
    });

    useEffect(() => {
        if (userLoading) return;

        if (!user || user.name === 'Temporary User') {
            toast.error('You must be a registered user to access this page');
            return;
        }

        if (!user.enabled) {
            toast.error('Your account is not activated. Please verify your email.');
        }

        form.reset({
            name: user.name,
            imageUrl: user.imageUrl || '',
            imageFile: undefined,
        });
    }, [user, userLoading, form, router]);

    const onSubmit = async (data: ProfileSettingsValues) => {
        setLoading(true);
        try {
            let finalImageUrl = data.imageUrl;
            if (data.imageFile && data.imageFile.length > 0) {
                finalImageUrl = await uploadToImgbb(data.imageFile[0]);
            }

            await axios.put('/api/v1/users/me', {
                name: data.name,
                imageUrl: finalImageUrl,
            });

            toast.success('Profile updated');
            await refreshUser();
        } catch (err) {
            console.error(err);
            toast.error('Update failed');
        } finally {
            setLoading(false);
        }
    };

    function FileUploadField({ field }: { field: FieldValues }) {
        const [preview, setPreview] = useState<string | null>(null);

        useEffect(() => {
            if (field.value?.[0]) {
                const objectUrl = URL.createObjectURL(field.value[0]);
                setPreview(objectUrl);
                return () => URL.revokeObjectURL(objectUrl);
            } else {
                setPreview(null);
            }
        }, [field.value]);

        return (
            <div className="space-y-2">
                <label
                    htmlFor="file-upload"
                    className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition font-medium"
                >
                    <UploadCloud className="w-4 h-4" />
                    Choose Image
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => field.onChange(e.target.files)}
                    className="hidden"
                />

                {field.value?.[0] && (
                    <div className="flex items-center gap-2 text-sm text-purple-600">
                        <ImageIcon className="w-4 h-4" />
                        <span>{field.value[0]?.name}</span>
                    </div>
                )}

                {preview && (
                    <div className="relative w-32 h-32 rounded-md overflow-hidden border border-purple-300">
                        <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="object-cover"
                            sizes="128px"
                        />
                        <button
                            type="button"
                            onClick={() => field.onChange(undefined)}
                            className="absolute top-1 right-1 bg-black/40 rounded-full p-1 text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        );
    }

    if (userLoading) {
        return <Loader subtitle="Fetching Profile Data..." />;
    }

    if (loading) {
        return (
            <div className="fixed top-0 left-0 w-full z-50 flex justify-center items-start pt-10 backdrop-blur bg-white/60">
                <Loader subtitle="Updating Profile..." />
            </div>
        );
    }

    return (
        <div className="min-h-[90%] flex flex-col lg:flex-row mt-20 w-full p-6 lg:p-10 bg-purple-50 text-purple-900">
            {/* Sidebar */}
            <aside className="w-full lg:w-64 bg-purple-100 text-purple-800 p-6 space-y-4 rounded-xl lg:rounded-r-none flex flex-col justify-between mb-8 lg:mb-0 shadow-sm">
                <div>
                    <h2 className="text-xl font-display font-semibold">Account</h2>
                    <p className="text-sm text-purple-600">Manage your account info.</p>
                    <nav className="mt-6 space-y-2">
                        <div className="font-medium text-purple-500">Profile</div>
                    </nav>
                </div>
                <div className="text-xs text-purple-500">
                    Secured by <span className="font-bold">EnderBrary</span>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 bg-white p-6 rounded-xl space-y-8 shadow-sm">
                <h1 className="text-2xl font-display font-semibold">Profile Details</h1>

                <div className="bg-purple-50 border border-purple-100 p-6 rounded-xl space-y-6 w-full max-w-2xl mx-auto">
                    {/* Profile Summary */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Image
                                src={encodeURI(user?.imageUrl || '') || '/default-avatar.png'}
                                alt="Profile"
                                width={48}
                                height={48}
                                className="rounded-full border border-purple-300"
                            />
                            <div className="text-lg font-display font-medium">{user?.name}</div>
                        </div>
                        <Button
                            type="submit"
                            form="profile-settings-form"
                            disabled={loading}
                            className="bg-purple-500 hover:bg-purple-600 text-white font-display font-medium"
                        >
                            {loading ? 'Saving...' : 'Update Profile'}
                        </Button>
                    </div>

                    {/* Form */}
                    <Form {...form}>
                        <form
                            id="profile-settings-form"
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-5 w-full"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image URL</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="https://..." />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="imageFile"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Or Upload Image</FormLabel>
                                        <FormControl>
                                            <FileUploadField field={field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}
