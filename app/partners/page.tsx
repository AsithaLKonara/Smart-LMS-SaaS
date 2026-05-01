
import { prisma } from "@/lib/db/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { TextGradient } from "@/components/ui/TextGradient";
import { PartnerDirectory } from "@/components/landing/PartnerDirectory";
import { BackgroundVideo } from "@/components/common/BackgroundVideo";

export default async function PartnersPage() {
    const partners = await prisma.tenant.findMany({
        where: { isPartner: true },
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
                            <span className="text-accent-cyan text-xs font-bold uppercase tracking-widest">Enterprise Ecosystem</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold font-heading tracking-tight text-text-primary">
                            Our Global <TextGradient>Partners</TextGradient>
                        </h1>
                        <p className="text-lg text-text-secondary max-w-2xl leading-relaxed">
                            Discover world-class educational organizations and institutes powering their academies with SmartLMS. 
                            Browse by expertise, location, and specialization.
                        </p>
                    </div>

                    <PartnerDirectory partners={partners} />

                    {partners.length === 0 && (
                        <div className="py-24 text-center">
                            <div className="inline-block p-12 glass border border-dashed border-white/10 rounded-3xl">
                                <p className="text-text-muted italic">Become our first certified partner. Join the ecosystem today.</p>
                            </div>
                        </div>
                    )}
                </Container>
            </section>

            <Footer />
        </main>
    );
}
