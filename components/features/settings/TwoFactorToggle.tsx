
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Smartphone, Loader2 } from "lucide-react";
import { toggleTwoFactor } from "@/app/actions/user";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/utils/cn";

interface TwoFactorToggleProps {
    initialEnabled: boolean;
}

export const TwoFactorToggle = ({ initialEnabled }: TwoFactorToggleProps) => {
    const [enabled, setEnabled] = useState(initialEnabled);
    const [isLoading, setIsLoading] = useState(false);

    const onToggle = async (checked: boolean) => {
        setIsLoading(true);
        // Optimistic update
        setEnabled(checked);

        const result = await toggleTwoFactor(checked);

        if (result.success) {
            toast.success(checked ? "2FA Enabled" : "2FA Disabled");
        } else {
            // Revert on failure
            setEnabled(!checked);
            toast.error(result.error || "Failed to update 2FA settings");
        }
        setIsLoading(false);
    };

    return (
        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 group hover:border-white/10 transition-colors">
            <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-accent-cyan/10">
                    <Smartphone className={cn("h-5 w-5", enabled ? "text-accent-cyan" : "text-text-muted")} />
                </div>
                <div>
                    <p className="text-sm font-medium text-text-primary">Two-Factor Authentication</p>
                    <p className="text-xs text-text-secondary">
                        {enabled ? "Add an extra layer of security" : "Currently disabled"}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-text-muted" />}
                <Switch
                    checked={enabled}
                    onCheckedChange={onToggle}
                    disabled={isLoading}
                />
            </div>
        </div>
    );
};
