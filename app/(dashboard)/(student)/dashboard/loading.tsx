
import { Container } from "@/components/layout/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-background-primary pb-20 md:pb-0">
            <Container className="py-8">
                {/* Welcome Section Skeleton */}
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2">
                        <div className="h-10 w-64 bg-white/5 animate-pulse rounded-lg" />
                        <div className="h-4 w-48 bg-white/5 animate-pulse rounded" />
                    </div>
                    <div className="h-8 w-32 bg-white/5 animate-pulse rounded-full" />
                </div>

                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} variant="elevated" className="border-white/5 shadow-none">
                            <CardHeader className="pb-2">
                                <div className="h-4 w-24 bg-white/5 animate-pulse rounded" />
                            </CardHeader>
                            <CardContent>
                                <div className="h-8 w-16 bg-white/5 animate-pulse rounded" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Continue Learning Skeleton */}
                <div className="mb-12">
                    <div className="h-6 w-48 bg-white/5 animate-pulse rounded mb-4" />
                    <Card variant="elevated" className="h-48 border-white/5 shadow-none">
                        <CardContent className="h-full flex items-center justify-center">
                            <div className="h-12 w-12 border-4 border-white/5 border-t-accent-cyan rounded-full animate-spin" />
                        </CardContent>
                    </Card>
                </div>

                {/* My Courses Skeleton */}
                <div className="mb-8">
                    <div className="h-6 w-32 bg-white/5 animate-pulse rounded mb-6" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} variant="elevated" className="h-64 border-white/5 shadow-none">
                                <div className="aspect-video bg-white/5 animate-pulse" />
                                <CardContent className="p-4 space-y-4">
                                    <div className="h-4 w-3/4 bg-white/5 animate-pulse rounded" />
                                    <div className="h-2 w-full bg-white/5 animate-pulse rounded-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
}
