
'use client';

import { UploadButton } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AssetUploadButton() {
    const router = useRouter();

    return (
        <UploadButton
            endpoint="assetLibrary"
            onClientUploadComplete={(res) => {
                toast.success("Upload complete!");
                router.refresh();
            }}
            onUploadError={(error: Error) => {
                toast.error(`Upload failed: ${error.message}`);
            }}
            appearance={{
                button: "bg-accent-cyan hover:bg-accent-cyan/90 text-black font-semibold px-6 py-2 rounded-lg transition-all shadow-neon-cyan",
                allowedContent: "text-[10px] text-text-muted mt-1"
            }}
        />
    );
}
