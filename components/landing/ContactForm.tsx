
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { submitLeadAction } from '@/app/actions/leads';
import { toast } from 'sonner';

export function ContactForm() {
    const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await submitLeadAction({ ...formData, type: 'DEMO' });
            if (res.success) {
                toast.success("Thanks! We'll be in touch soon.");
                setFormData({ name: '', email: '', company: '', message: '' });
            } else {
                toast.error("Something went wrong");
            }
        } catch (err) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10 glass-hover">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm text-text-secondary">Full Name</label>
                    <input 
                        className="w-full bg-background-secondary border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:ring-1 focus:ring-accent-cyan outline-none"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-text-secondary">Work Email</label>
                    <input 
                        type="email"
                        className="w-full bg-background-secondary border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:ring-1 focus:ring-accent-cyan outline-none"
                        placeholder="john@company.com"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        required
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm text-text-secondary">Company</label>
                <input 
                    className="w-full bg-background-secondary border border-white/10 rounded-xl px-4 py-3 text-text-primary focus:ring-1 focus:ring-accent-cyan outline-none"
                    placeholder="Acme Corp"
                    value={formData.company}
                    onChange={e => setFormData({...formData, company: e.target.value})}
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm text-text-secondary">How can we help?</label>
                <textarea 
                    className="w-full bg-background-secondary border border-white/10 rounded-xl px-4 py-3 text-text-primary h-32 focus:ring-1 focus:ring-accent-cyan outline-none"
                    placeholder="Tell us about your organization's learning needs..."
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                />
            </div>
            <Button type="submit" className="w-full h-14 bg-accent-cyan text-black font-bold text-lg" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Book My Demo'}
            </Button>
        </form>
    );
}
