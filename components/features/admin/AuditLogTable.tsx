
'use client';

import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Shield, User, Globe, Clock, Info } from 'lucide-react';

interface AuditLogTableProps {
    logs: any[];
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
    return (
        <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-accent-purple" /> Global Audit Trail
                </CardTitle>
                <div className="flex gap-2">
                    <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-text-muted flex items-center gap-2">
                        <Clock className="w-3 h-3" /> Live Feed
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5 text-left">
                                <th className="pb-4 text-xs font-bold text-text-muted uppercase tracking-widest px-4">Event</th>
                                <th className="pb-4 text-xs font-bold text-text-muted uppercase tracking-widest px-4">Actor</th>
                                <th className="pb-4 text-xs font-bold text-text-muted uppercase tracking-widest px-4">Details</th>
                                <th className="pb-4 text-xs font-bold text-text-muted uppercase tracking-widest px-4">Origin</th>
                                <th className="pb-4 text-xs font-bold text-text-muted uppercase tracking-widest px-4">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                                <Info className="w-4 h-4 text-accent-cyan" />
                                            </div>
                                            <span className="text-sm font-bold text-text-primary uppercase tracking-tight">{log.action}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-text-muted" />
                                            <span className="text-sm text-text-secondary">{log.actor.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-xs text-text-muted font-mono bg-white/5 px-2 py-1 rounded">
                                            {log.resource}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2 text-xs text-text-muted">
                                            <Globe className="w-3 h-3" /> {log.ipAddress}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-xs text-text-muted">
                                            {format(new Date(log.createdAt), 'MMM dd, HH:mm:ss')}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {logs.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-text-muted italic">No audit logs found. Security event monitoring is active.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
