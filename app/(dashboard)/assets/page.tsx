
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/db/prisma";
import { Container } from "@/components/layout/Container";
import { AssetGrid } from "@/components/features/assets/AssetGrid";
import { AssetUploadButton } from "@/components/features/assets/AssetUploadButton";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { FileUp } from "lucide-react";

export default async function AssetLibraryPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const assets = await prisma.asset.findMany({
        where: {
            tenantId: session.user.tenantId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <Container className="py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Asset Library</h1>
                    <p className="text-text-secondary">Manage your course materials and files</p>
                </div>
                <AssetUploadButton />
            </div>

            {assets.length === 0 ? (
                <Card variant="default" className="border-dashed border-2 bg-transparent">
                    <CardContent className="py-20 text-center flex flex-col items-center">
                        <div className="bg-accent-cyan/10 p-4 rounded-full mb-4">
                            <FileUp className="w-8 h-8 text-accent-cyan" />
                        </div>
                        <h3 className="text-xl font-semibold text-text-primary mb-2">
                            No assets yet
                        </h3>
                        <p className="text-text-secondary max-w-sm mx-auto">
                            Upload your first file to get started. Supports images, videos, and documents.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <AssetGrid assets={assets as any} />
            )}
        </Container>
    );
}
