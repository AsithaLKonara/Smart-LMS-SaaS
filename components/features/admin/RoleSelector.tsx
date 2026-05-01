'use client';

import { useState } from 'react';
import { RoleType } from '@prisma/client';
import { assignUserRole } from '@/app/actions/roles';
import { ChevronDown, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface RoleSelectorProps {
    userId: string;
    currentRole: RoleType;
    currentUserRole: string;
}

const ROLES = Object.values(RoleType);

export function RoleSelector({ userId, currentRole, currentUserRole }: RoleSelectorProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState(currentRole);

    const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = e.target.value as RoleType;
        if (newRole === role) return;

        setIsLoading(true);
        try {
            const result = await assignUserRole(userId, newRole);
            if (result.success) {
                setRole(newRole);
                toast.success(`Role updated to ${newRole.replace('_', ' ')}`);
            } else {
                toast.error(result.error || 'Failed to update role');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    // Permission check for the UI
    const canManageSuperAdmin = currentUserRole === 'SUPER_ADMIN';
    const isDisabled = isLoading || (role === 'SUPER_ADMIN' && !canManageSuperAdmin);
    
    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none">
                    <Loader2 className="h-3 w-3 animate-spin text-accent-cyan" />
                </div>
            )}
            <select
                value={role}
                onChange={handleRoleChange}
                disabled={isDisabled}
                className="bg-background-secondary border border-white/10 rounded-lg px-3 py-1.5 text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-purple/50 appearance-none pr-8 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {ROLES.map((r) => {
                    // Hide Super Admin role from non-super admins
                    if (r === 'SUPER_ADMIN' && !canManageSuperAdmin) return null;
                    
                    return (
                        <option key={r} value={r}>
                            {r.replace('_', ' ')}
                        </option>
                    );
                })}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-text-muted pointer-events-none" />
        </div>
    );
}

