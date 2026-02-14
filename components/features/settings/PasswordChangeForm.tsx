
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Key } from "lucide-react";
import { changePassword } from "@/app/actions/user";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const formSchema = z.object({
    current: z.string().min(1, "Current password is required"),
    new: z.string().min(8, "New password must be at least 8 characters"),
    confirm: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.new === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
});

export const PasswordChangeForm = () => {
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            current: "",
            new: "",
            confirm: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const result = await changePassword({
            current: values.current,
            new: values.new
        });

        if (result.success) {
            toast.success("Password updated successfully");
            form.reset();
            setIsEditing(false);
        } else {
            toast.error(result.error || "Something went wrong");
        }
    };

    if (!isEditing) {
        return (
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 group hover:border-white/10 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-accent-purple/10">
                        <Key className="h-5 w-5 text-accent-purple" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-text-primary">Password</p>
                        <p className="text-xs text-text-secondary">Security requirement: at least 8 characters</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-accent-cyan hover:underline"
                >
                    Change
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6 rounded-lg bg-white/5 border border-white/10">
            <h3 className="text-lg font-medium text-text-primary mb-2">Change Password</h3>

            <div className="space-y-2">
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Current Password</label>
                <Input
                    type="password"
                    {...form.register("current")}
                    disabled={isSubmitting}
                    className="bg-background-secondary border-none"
                    placeholder="••••••••"
                />
                {form.formState.errors.current && (
                    <p className="text-xs text-red-500">{form.formState.errors.current.message}</p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">New Password</label>
                    <Input
                        type="password"
                        {...form.register("new")}
                        disabled={isSubmitting}
                        className="bg-background-secondary border-none"
                        placeholder="••••••••"
                    />
                    {form.formState.errors.new && (
                        <p className="text-xs text-red-500">{form.formState.errors.new.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">Confirm New Password</label>
                    <Input
                        type="password"
                        {...form.register("confirm")}
                        disabled={isSubmitting}
                        className="bg-background-secondary border-none"
                        placeholder="••••••••"
                    />
                    {form.formState.errors.confirm && (
                        <p className="text-xs text-red-500">{form.formState.errors.confirm.message}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-x-2 pt-2">
                <Button type="submit" disabled={!isValid || isSubmitting}>
                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Update Password
                </Button>
                <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setIsEditing(false)}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
};
