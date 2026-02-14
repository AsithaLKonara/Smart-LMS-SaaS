
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Loader2, PlusCircle } from "lucide-react";
import { Module, Lesson } from "@prisma/client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { createModule, reorderModules, reorderLessons } from "@/app/actions/courses";
import { ModuleList } from "./ModuleList";
// import { toast } from "sonner";

// Define the type for Module with Lessons, reusing the Prisma types
type ModuleWithLessons = Module & {
    lessons: Lesson[];
};

interface ModulesFormProps {
    initialData: {
        modules: ModuleWithLessons[];
    };
    courseId: string;
}

const formSchema = z.object({
    title: z.string().min(1),
});

export const ModulesForm = ({
    initialData,
    courseId
}: ModulesFormProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const toggleCreating = () => {
        setIsCreating((current) => !current);
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsUpdating(true);
            await createModule(courseId, values.title);
            toggleCreating();
            form.reset();
            router.refresh();
        } catch {
            // toast.error("Something went wrong");
            console.error("Something went wrong");
        } finally {
            setIsUpdating(false);
        }
    }

    const onReorder = async (updateData: { id: string; position: number }[]) => {
        try {
            setIsUpdating(true);
            await reorderModules(courseId, updateData);
            router.refresh();
            // toast.success("Modules reordered");
        } catch {
            // toast.error("Something went wrong");
        } finally {
            setIsUpdating(false);
        }
    }

    const onLessonReorder = async (updateData: { id: string; position: number }[], moduleId: string) => {
        try {
            setIsUpdating(true);
            await reorderLessons(courseId, moduleId, updateData);
            router.refresh();
            // toast.success("Lessons reordered");
        } catch {
            // toast.error("Something went wrong");
        } finally {
            setIsUpdating(false);
        }
    }

    //   const onEdit = (id: string) => {
    //     router.push(`/instructor/courses/${courseId}/modules/${id}`);
    //   }

    return (
        <div className="relative mt-6 border border-white/10 rounded-md p-4 bg-background-elevated">
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center z-10 backdrop-blur-sm">
                    <Loader2 className="h-6 w-6 animate-spin text-accent-cyan" />
                </div>
            )}
            <div className="flex items-center justify-between font-medium text-text-primary mb-4">
                Course Modules
                <Button onClick={toggleCreating} variant="ghost" size="sm">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add a module
                        </>
                    )}
                </Button>
            </div>

            {isCreating && (
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-4"
                >
                    <div className="flex items-center gap-x-2">
                        <Input
                            disabled={isSubmitting}
                            placeholder="e.g. 'Introduction to the course'"
                            {...form.register("title")}
                            className="bg-background-secondary border-none"
                        />
                        <Button
                            disabled={!isValid || isSubmitting}
                            type="submit"
                        >
                            Create
                        </Button>
                    </div>
                </form>
            )}

            {!isCreating && (
                <div className={cn(
                    "text-sm mt-2",
                    !initialData.modules.length && "text-text-secondary italic"
                )}>
                    {!initialData.modules.length && "No modules"}
                    <ModuleList
                        initialData={initialData.modules}
                        courseId={courseId}
                        onReorder={onReorder}
                        onLessonReorder={onLessonReorder}
                    // onEdit={onEdit}
                    />
                </div>
            )}

            {!isCreating && (
                <p className="text-xs text-text-muted mt-4">
                    Drag and drop to reorder modules and lessons
                </p>
            )}
        </div>
    );
}
