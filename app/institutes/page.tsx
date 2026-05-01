
import { prisma } from "@/lib/db/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { TextGradient } from "@/components/ui/TextGradient";
import { InstituteDirectory } from "@/components/landing/InstituteDirectory";
import { BackgroundVideo } from "@/components/common/BackgroundVideo";

export const dynamic = "force-dynamic";

export default async function InstitutesPage() {
    const institutes = await prisma.tenant.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <main className="min-h-screen bg-transparent overflow-x-hidden relative">
            <BackgroundVideo src="/videos/0428.mp4" videoOpacity="opacity-20" overlayOpacity="bg-black/70" />
            <Header />

            <section className="pt-32 pb-24 relative z-10">
                <Container>
                    <div className="flex flex-col items-center text-center gap-6 mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 w-fit">
                            <span className="text-accent-cyan text-xs font-bold uppercase tracking-widest">Global Ecosystem</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold font-heading tracking-tight text-text-primary">
                            Explore <TextGradient>Institutes</TextGradient>
                        </h1>
                        <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
                            Discover world-class educational organizations and institutes powering their academies with SmartLMS. 
                            Browse by expertise, location, and specialization.
                        </p>
                    </div>

                    <InstituteDirectory institutes={institutes} />

                    {institutes.length === 0 && (
                        <div className="py-24 text-center">
                            <div className="inline-block p-12 glass border border-dashed border-white/10 rounded-3xl">
                                <p className="text-text-muted italic">Join the ecosystem today and launch your own academy.</p>
                            </div>
                        </div>
                    )}
                </Container>
            </section>

            <Footer />
        </main>
    );
}
