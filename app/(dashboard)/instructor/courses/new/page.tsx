
"use client";

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Container } from '@/components/layout/Container';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createCourse } from '@/app/actions/courses'; // We need to create this server action

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is required",
    }),
});

export default function CreateCoursePage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await createCourse(values);
            router.push(`/instructor/courses/${response.id}`);
        } catch {
            setError("Something went wrong");
        }
    }

    return (
        <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
            <Card variant="elevated" className="max-w-md w-full">
                <CardHeader>
                    <CardTitle>Name your course</CardTitle>
                    <CardDescription>
                        What would you like to name your course? Don&apos;t worry, you can change this later.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-text-secondary">
                                Course Title
                            </label>
                            <Input
                                disabled={isSubmitting}
                                placeholder="e.g. Advanced Web Development"
                                {...form.register("title")}
                            />
                            {form.formState.errors.title && (
                                <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                            )}
                        </div>

                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}

                        <div className="flex items-center gap-x-2">
                            <Link href="/instructor/courses">
                                <Button type="button" variant="ghost">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={!isValid || isSubmitting}>
                                Continue
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
