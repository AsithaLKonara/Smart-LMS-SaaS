import { createUploadthing, type FileRouter } from "uploadthing/next";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

const f = createUploadthing();

export const ourFileRouter = {
  courseThumbnail: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const user = await requireAuth();
      if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
          throw new Error("Unauthorized");
      }
      return { userId: user.id, tenantId: user.tenantId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId };
    }),

  assetLibrary: f(["image", "video", "pdf", "blob"])
    .middleware(async () => {
        const user = await requireAuth();
        return { userId: user.id, tenantId: user.tenantId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
        // Automatically create an Asset record in the database
        const getAssetType = (name: string) => {
            const ext = name.split('.').pop()?.toLowerCase();
            if (['jpg', 'jpeg', 'png', 'svg', 'webp'].includes(ext!)) return 'IMAGE';
            if (['mp4', 'mov', 'avi'].includes(ext!)) return 'VIDEO';
            if (['pdf', 'doc', 'docx', 'ppt', 'pptx'].includes(ext!)) return 'DOCUMENT';
            if (ext === 'zip') return 'SCORM';
            return 'OTHER';
        };

        await prisma.asset.create({
            data: {
                tenantId: metadata.tenantId,
                uploadedById: metadata.userId,
                name: file.name,
                url: file.url,
                sizeBytes: file.size,
                type: getAssetType(file.name) as any,
            }
        });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
