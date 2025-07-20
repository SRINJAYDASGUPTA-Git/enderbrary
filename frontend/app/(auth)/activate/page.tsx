"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {toast} from "sonner"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import {InputOTP, InputOTPGroup, InputOTPSlot,} from "@/components/ui/input-otp"

import axios from "@/utils/axiosInstance"
import {useState} from "react";
import Loader from "@/components/Loader";

const FormSchema = z.object({
    pin: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
})

export default function InputOTPForm() {
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try{
            setLoading(true);
            const response = await axios.post(`/api/v1/auth/activate?token=${data.pin}`);
            if (response.status === 200) {
                toast.success("Account activated successfully!");
                const data = await response.data;
                localStorage.setItem('accessToken', data.access_token);
                localStorage.setItem('refreshToken', data.refresh_token);
                window.location.replace("/");
            } else {
                toast.error("Activation failed. Please check your OTP and try again.");
            }
        } catch (error) {
            console.error("Error during activation:", error);
            toast.error("Activation failed. Please try again.");
            return;
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <Loader subtitle={'Activating your account...'} />
            </div>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 max-w-md mx-auto mt-10 p-6 bg-gray-950 shadow-md rounded-lg space-y-4 relative">
                <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>One-Time Password</FormLabel>
                            <FormControl>
                                <InputOTP maxLength={6} {...field} className="w-full" containerClassName="justify-center">
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormDescription>
                                Please enter the one-time password sent to your email. Please check your spam folder if you don&apos;t see it.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className={'cursor-pointer'}>Submit</Button>
            </form>
        </Form>
    )
}
