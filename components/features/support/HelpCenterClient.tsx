
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { createTicketAction } from '@/app/actions/support';
import { toast } from 'sonner';
import { MessageSquare, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface HelpCenterClientProps {
    initialTickets: any[];
}

export function HelpCenterClient({ initialTickets }: HelpCenterClientProps) {
    const [tickets, setTickets] = useState(initialTickets);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({ subject: '', description: '', priority: 'MEDIUM' as any });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await createTicketAction(formData);
            if (res.success) {
                toast.success("Ticket created successfully");
                setIsCreating(false);
                setFormData({ subject: '', description: '', priority: 'MEDIUM' });
                // Note: Realistically we'd fetch or revalidate, but for UX we can just optimistic update or rely on revalidatePath
            } else {
                toast.error(res.error);
            }
        } catch (err) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-text-primary">Support Tickets</h2>
                <Button variant="premium" onClick={() => setIsCreating(true)}>
                    <Plus className="w-4 h-4 mr-2" /> New Ticket
                </Button>
            </div>

            {isCreating && (
                <Card variant="glass" className="border-accent-cyan/20">
                    <CardHeader>
                        <CardTitle>Open a Support Ticket</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-text-secondary">Subject</label>
                                <input 
                                    className="w-full bg-background-secondary border border-white/10 rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-cyan"
                                    value={formData.subject}
                                    onChange={e => setFormData({...formData, subject: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-text-secondary">Description</label>
                                <textarea 
                                    className="w-full bg-background-secondary border border-white/10 rounded-lg px-4 py-2 text-text-primary h-32 focus:outline-none focus:ring-1 focus:ring-accent-cyan"
                                    value={formData.description}
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="flex gap-4">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Submit Ticket'}
                                </Button>
                                <Button variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 gap-4">
                {tickets.map(ticket => (
                    <Card key={ticket.id} variant="glass-dark" className="hover:border-white/20 transition-all cursor-pointer">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${
                                    ticket.status === 'OPEN' ? 'bg-accent-cyan/10 text-accent-cyan' :
                                    ticket.status === 'RESOLVED' ? 'bg-green-500/10 text-green-500' :
                                    'bg-white/10 text-text-secondary'
                                }`}>
                                    {ticket.status === 'OPEN' ? <Clock className="w-5 h-5" /> : 
                                     ticket.status === 'RESOLVED' ? <CheckCircle className="w-5 h-5" /> : 
                                     <AlertCircle className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-primary">{ticket.subject}</h4>
                                    <p className="text-xs text-text-muted">Created on {format(new Date(ticket.createdAt), 'MMM dd, yyyy')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className={`text-[10px] font-bold uppercase tracking-widest ${
                                        ticket.priority === 'URGENT' ? 'text-red-500' :
                                        ticket.priority === 'HIGH' ? 'text-orange-500' :
                                        'text-accent-cyan'
                                    }`}>
                                        {ticket.priority} Priority
                                    </p>
                                    <p className="text-xs text-text-secondary">{ticket.messages.length} messages</p>
                                </div>
                                <MessageSquare className="w-5 h-5 text-text-muted" />
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {tickets.length === 0 && !isCreating && (
                    <div className="p-12 text-center text-text-secondary border-2 border-dashed border-white/5 rounded-2xl">
                        No active support tickets. Need help? Open a ticket above.
                    </div>
                )}
            </div>
        </div>
    );
}
