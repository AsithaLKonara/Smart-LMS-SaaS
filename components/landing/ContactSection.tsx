
import { Container } from "@/components/layout/Container";
import { ContactForm } from "./ContactForm";
import { motion } from "framer-motion";
import { TextGradient } from "../ui/TextGradient";

export function ContactSection() {
    return (
        <section id="contact" className="py-24 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-cyan/5 blur-[120px] rounded-full -z-10" />
            
            <Container>
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 w-fit">
                            <span className="text-accent-cyan text-xs font-bold uppercase tracking-widest">Connect with Us</span>
                        </div>
                        <h2 className="text-4xl lg:text-6xl font-bold font-heading text-text-primary leading-tight">
                            Ready to Transform your <br />
                            <TextGradient>Learning Experience?</TextGradient>
                        </h2>
                        <p className="text-lg text-text-secondary leading-relaxed max-w-md">
                            Join 100+ organizations building the future of education on SmartLMS. Get a personalized walkthrough of our AI-powered features.
                        </p>
                        
                        <div className="space-y-6 pt-4">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-accent-cyan/10 flex items-center justify-center text-accent-cyan shrink-0">
                                    <span className="font-bold">01</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-primary">Personalized Demo</h4>
                                    <p className="text-sm text-text-muted">See how AI can automate your course creation and grading.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-accent-purple/10 flex items-center justify-center text-accent-purple shrink-0">
                                    <span className="font-bold">02</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-primary">Migration Assistance</h4>
                                    <p className="text-sm text-text-muted">Switching from Moodle or Canvas? We handle the heavy lifting.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <ContactForm />
                </div>
            </Container>
        </section>
    );
}
