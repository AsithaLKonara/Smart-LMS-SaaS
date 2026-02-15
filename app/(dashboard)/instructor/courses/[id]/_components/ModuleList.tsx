
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil, Trash, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Module, Lesson } from "@prisma/client";
import { createLesson } from "@/app/actions/courses";

interface ModuleListProps {
    initialData: (Module & { lessons: Lesson[] })[];
    onReorder: (updateData: { id: string; position: number }[]) => void;
    onLessonReorder: (updateData: { id: string; position: number }[], moduleId: string) => void;
    onEdit?: (id: string) => void;
    courseId: string;
}

export const ModuleList = ({
    initialData,
    onReorder,
    onLessonReorder,
    onEdit,
    courseId
}: ModuleListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [modules, setModules] = useState(initialData);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setModules(initialData);
    }, [initialData]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source, type } = result;

        if (!destination) return;

        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        if (type === "modules") {
            const items = Array.from(modules);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);

            setModules(items);

            const bulkUpdateData = items.map((module, index) => ({
                id: module.id,
                position: index + 1,
            }));

            onReorder(bulkUpdateData);
        }

        if (type === "lessons") {
            const moduleId = source.droppableId;
            const moduleIndex = modules.findIndex(m => m.id === moduleId);

            if (moduleIndex === -1) return;

            const newModules = [...modules];
            const items = Array.from(newModules[moduleIndex].lessons);
            const [reorderedItem] = items.splice(source.index, 1);
            items.splice(destination.index, 0, reorderedItem);

            newModules[moduleIndex].lessons = items;
            setModules(newModules);

            const bulkUpdateData = items.map((lesson, index) => ({
                id: lesson.id,
                position: index + 1,
            }));

            onLessonReorder(bulkUpdateData, moduleId);
        }
    };

    const handleAddLesson = async (moduleId: string) => {
        try {
            const lesson = await createLesson(courseId, moduleId, "New Lesson");
            router.push(`/instructor/courses/${courseId}/lessons/${lesson.id}`);
        } catch (error) {
            console.error(error);
        }
    }

    if (!isMounted) {
        return null;
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="modules" type="modules">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {modules.map((module, index) => (
                            <Draggable
                                key={module.id}
                                draggableId={module.id}
                                index={index}
                            >
                                {(provided) => (
                                    <div
                                        className={cn(
                                            "bg-background-primary border-slate-700 border text-text-primary rounded-md mb-4 text-sm",
                                        )}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                    >
                                        <div className="flex items-center gap-x-2 border-b border-b-slate-700/50 bg-slate-800/20 px-2 py-3">
                                            <div
                                                className={cn(
                                                    "px-2 py-1 hover:bg-slate-700/50 rounded cursor-grab",
                                                )}
                                                {...provided.dragHandleProps}
                                            >
                                                <Grip className="h-5 w-5" />
                                            </div>
                                            <span className="font-semibold">{module.title}</span>
                                            <div className="ml-auto flex items-center gap-x-2">
                                                <Badge variant={module.lessons.length ? "default" : "secondary"}>
                                                    {module.lessons.length} {module.lessons.length === 1 ? "Lesson" : "Lessons"}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <Droppable droppableId={module.id} type="lessons">
                                                {(provided) => (
                                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                                        {module.lessons.map((lesson, index) => (
                                                            <Draggable key={lesson.id} draggableId={lesson.id} index={index}>
                                                                {(provided) => (
                                                                    <div
                                                                        className="flex items-center justify-between text-sm text-text-secondary bg-background-elevated p-2 rounded border border-white/5 hover:bg-white/5 transition"
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <Grip className="h-4 w-4 opacity-50" />
                                                                            <span>{lesson.title}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-x-2">
                                                                            {lesson.isFree && <Badge variant="default" className="text-[10px] h-5 px-1">Free</Badge>}
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-6 w-6"
                                                                                onClick={() => router.push(`/instructor/courses/${courseId}/lessons/${lesson.id}`)}
                                                                            >
                                                                                <Pencil className="w-4 h-4 text-accent-cyan" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full mt-4"
                                                onClick={() => handleAddLesson(module.id)}
                                            >
                                                <PlusCircle className="w-4 h-4 mr-2" />
                                                Add Lesson
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};
