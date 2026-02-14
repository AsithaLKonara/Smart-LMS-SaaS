
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateProfile } from "@/app/actions/user";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { User, Camera, Check, Loader2 } from "lucide-react";

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    avatar: z.string().optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
    initialData: {
        name: string;
        email: string;
        avatar?: string;
    };
}

export const ProfileForm = ({ initialData }: ProfileFormProps) => {
    const [isPending, setIsPending] = useState(false);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: initialData.name,
            avatar: initialData.avatar,
        },
    });

    const onSubmit = async (data: ProfileValues) => {
        setIsPending(true);
        setSuccess(false);
        try {
            const result = await updateProfile(data);
            if (result.success) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                alert(result.error);
            }
        } catch (error) {
            alert("Something went wrong");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Card variant="elevated">
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col items-center gap-4 mb-6">
                        <div className="relative group">
                            <div className="h-24 w-24 rounded-full bg-background-secondary border-2 border-white/10 flex items-center justify-center overflow-hidden">
                                {initialData.avatar ? (
                                    <img src={initialData.avatar} alt={initialData.name} className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-10 w-10 text-text-secondary" />
                                )}
                            </div>
                            <button
                                type="button"
                                className="absolute bottom-0 right-0 p-2 bg-accent-cyan rounded-full text-black hover:scale-110 transition-transform"
                                onClick={() => alert("Upload functionality coming soon!")}
                            >
                                <Camera className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="text-xs text-text-secondary">Click camera to change avatar</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Full Name</label>
                            <Input
                                {...register("name")}
                                placeholder="Your Name"
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">Email Address</label>
                            <Input
                                value={initialData.email}
                                disabled
                                className="opacity-50 cursor-not-allowed bg-white/5"
                            />
                            <p className="text-[10px] text-text-muted italic">Email cannot be changed for security reasons.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <Button type="submit" disabled={isPending} className="min-w-[120px]">
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : success ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                        {success && (
                            <span className="text-sm text-green-500 flex items-center gap-2">
                                <Check className="h-4 w-4" /> Profile updated successfully!
                            </span>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
