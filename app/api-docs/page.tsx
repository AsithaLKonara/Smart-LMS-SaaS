
"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import { Loader2 } from "lucide-react";

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
    ssr: false,
    loading: () => (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-accent-cyan" />
        </div>
    )
});

export default function ApiDocsPage() {
    return (
        <div className="bg-white min-h-screen">
            <SwaggerUI url="/api/docs" />
        </div>
    );
}
