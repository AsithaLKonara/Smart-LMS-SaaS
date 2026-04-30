
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { toast } from 'sonner';
import { UserPlus, Trash2 } from 'lucide-react';
import { enrollStudentsAction } from '@/app/actions/enrollment';

interface StudentBulkActionsProps {
    studentIds: string[];
    selectedIds: string[];
    setSelectedIds: (ids: string[]) => void;
    availableCourses: Array<{ id: string, title: string }>;
    onToggleAll: () => void;
}

export function StudentBulkActions({ 
    studentIds, 
    selectedIds, 
    setSelectedIds, 
    availableCourses,
    onToggleAll
}: StudentBulkActionsProps) {
    const [isPending, setIsPending] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState('');

    const handleBulkEnroll = async () => {
        if (selectedIds.length === 0 || !selectedCourseId) {
            toast.error("Select students and a course first");
            return;
        }

        setIsPending(true);
        try {
            const result = await enrollStudentsAction(selectedIds, selectedCourseId);
            if (result.success) {
                toast.success(`Successfully enrolled ${selectedIds.length} students`);
                setSelectedIds([]);
            } else {
                toast.error(result.error || "Enrollment failed");
            }
        } catch (err) {
            toast.error("An error occurred");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-4">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={onToggleAll}
                        className="text-[10px]"
                    >
                        {selectedIds.length === studentIds.length && studentIds.length > 0 ? 'Deselect All' : 'Select All'}
                    </Button>
                    <span className="text-sm text-text-secondary">
                        {selectedIds.length} selected
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <select 
                        className="bg-background-secondary border border-white/10 rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-cyan"
                        value={selectedCourseId}
                        onChange={(e) => setSelectedCourseId(e.target.value)}
                    >
                        <option value="">Select Course...</option>
                        {availableCourses.map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                    </select>
                    <Button 
                        size="sm" 
                        className="bg-accent-cyan text-black" 
                        onClick={handleBulkEnroll}
                        disabled={isPending || selectedIds.length === 0 || !selectedCourseId}
                    >
                        <UserPlus className="w-4 h-4 mr-2" /> Enroll
                    </Button>
                </div>
            </div>
        </div>
    );
}
