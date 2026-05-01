
import { prisma } from "@/lib/db/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { TextGradient } from "@/components/ui/TextGradient";
import { notFound } from "next/navigation";
import { 
    Globe, 
    Users, 
    BookOpen, 
    Calendar, 
    MapPin, 
    ShieldCheck, 
    ArrowLeft,
    ExternalLink
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default async function InstituteDetailsPage({ 
    params 
}: { 
    params: Promise<{ subdomain: string }> 
}) {
    const { subdomain } = await params;
    
    const institute = await prisma.tenant.findUnique({
        where: { subdomain },
        include: {
            _count: {
                select: {
                    users: true,
                    courses: true,
                }
            }
        }
    });

    if (!institute || institute.status !== 'ACTIVE') {
        return notFound();
    }

    const accentColor = institute.accentColor || '#22D3EE';

    return (
        <main className="min-h-screen bg-transparent relative">
            <Header />
            
            <section className="pt-32 pb-24 relative overflow-hidden">
                {/* Background Accent */}
                <div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-10 blur-[120px] rounded-full"
                    style={{ backgroundColor: accentColor }}
                />

                <Container className="relative z-10">
                    <Link 
                        href="/institutes" 
                        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Institutes
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left Column: Branding & Info */}
                        <div className="lg:col-span-2 space-y-12">
                            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                                {institute.logo ? (
                                    <div className="w-32 h-32 rounded-3xl bg-background-secondary border border-white/10 shadow-premium overflow-hidden flex-shrink-0">
                                        <img src={institute.logo} alt={institute.name} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                        <Globe className="w-12 h-12 text-text-muted" />
                                    </div>
                                )}
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight">
                                            {institute.name}
                                        </h1>
                                        {institute.verifiedAt && (
                                            <ShieldCheck className="w-8 h-8 text-accent-cyan" />
                                        )}
                                    </div>
                                    <p className="text-xl text-text-secondary font-medium italic">
                                        {institute.tagline || "Global Excellence in Digital Education"}
                                    </p>
                                </div>
                            </div>

                            <div className="prose prose-invert max-w-none">
                                <h3 className="text-2xl font-bold text-text-primary">About the Institute</h3>
                                <p className="text-lg text-text-secondary leading-relaxed">
                                    {institute.publicDescription || `${institute.name} is a leading educational institution powered by SmartLMS. We are committed to providing world-class learning experiences through our digital academy.`}
                                </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card variant="glass" className="border-white/5">
                                    <CardContent className="p-6 text-center">
                                        <Users className="w-6 h-6 mx-auto mb-2 text-accent-cyan" />
                                        <h4 className="text-2xl font-bold text-text-primary">{institute._count.users}</h4>
                                        <p className="text-[10px] uppercase font-bold text-text-muted">Students</p>
                                    </CardContent>
                                </Card>
                                <Card variant="glass" className="border-white/5">
                                    <CardContent className="p-6 text-center">
                                        <BookOpen className="w-6 h-6 mx-auto mb-2 text-accent-purple" />
                                        <h4 className="text-2xl font-bold text-text-primary">{institute._count.courses}</h4>
                                        <p className="text-[10px] uppercase font-bold text-text-muted">Courses</p>
                                    </CardContent>
                                </Card>
                                <Card variant="glass" className="border-white/5">
                                    <CardContent className="p-6 text-center">
                                        <MapPin className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
                                        <h4 className="text-sm font-bold text-text-primary truncate">{institute.timezone}</h4>
                                        <p className="text-[10px] uppercase font-bold text-text-muted">Location</p>
                                    </CardContent>
                                </Card>
                                <Card variant="glass" className="border-white/5">
                                    <CardContent className="p-6 text-center">
                                        <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-amber-400" />
                                        <h4 className="text-sm font-bold text-text-primary uppercase">{institute.plan}</h4>
                                        <p className="text-[10px] uppercase font-bold text-text-muted">Certified</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Right Column: Actions & Details */}
                        <div className="space-y-6">
                            <Card variant="elevated" className="border-white/10 bg-white/[0.02] backdrop-blur-3xl p-8 space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-text-primary mb-4">Join Academy</h3>
                                    <p className="text-sm text-text-secondary mb-6">
                                        Ready to start your learning journey? Enroll in courses offered by {institute.name} today.
                                    </p>
                                    <Link href={`https://${institute.subdomain}.smartlms.space`}>
                                        <Button variant="premium" className="w-full shadow-neon-purple py-6 text-lg">
                                            Visit Learning Portal
                                            <ExternalLink className="ml-2 w-5 h-5" />
                                        </Button>
                                    </Link>
                                </div>

                                <div className="pt-6 border-t border-white/5 space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-text-muted">Status</span>
                                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                                            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                            Online
                                        </span>
                                    </div>
                                    {institute.websiteUrl && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-text-muted">Official Site</span>
                                            <Link href={institute.websiteUrl} className="text-accent-cyan hover:underline truncate max-w-[150px]">
                                                {institute.websiteUrl.replace(/^https?:\/\//, '')}
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </Container>
            </section>

            <Footer />
        </main>
    );
}
