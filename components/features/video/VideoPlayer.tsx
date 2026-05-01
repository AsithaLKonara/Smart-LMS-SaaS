
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';

interface VideoPlayerProps {
    provider: 'YOUTUBE' | 'VIMEO' | 'BUNNY_NET' | 'WISTIA' | 'CUSTOM_HLS';
    externalId: string;
    config?: any;
    className?: string;
}

export function VideoPlayer({ provider, externalId, config, className }: VideoPlayerProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    if (!externalId) return (
        <div className="aspect-video bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 italic text-text-muted">
            No video content provided
        </div>
    );

    const getEmbedUrl = () => {
        switch (provider) {
            case 'YOUTUBE':
                // YouTube embed with controls hidden and modestbranding
                return `https://www.youtube-nocookie.com/embed/${externalId}?rel=0&modestbranding=1&controls=1&showinfo=0`;
            case 'VIMEO':
                // Vimeo embed with title/byline hidden
                return `https://player.vimeo.com/video/${externalId}?badge=0&autopause=0&player_id=0&app_id=58479`;
            case 'BUNNY_NET':
                // Bunny.net Stream (Very high security)
                return `https://iframe.mediadelivery.net/embed/${config?.libraryId || ''}/${externalId}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`;
            case 'WISTIA':
                return `https://fast.wistia.net/embed/iframe/${externalId}`;
            default:
                return '';
        }
    };

    return (
        <div className={cn("relative aspect-video rounded-3xl overflow-hidden shadow-premium border border-white/10 bg-black group", className)}>
            {/* Security Overlay (Disable right-click and prevent simple "Save As") */}
            <div 
                className="absolute inset-0 z-10 pointer-events-none" 
                onContextMenu={(e) => e.preventDefault()}
            />
            
            <iframe
                src={getEmbedUrl()}
                className={cn(
                    "w-full h-full border-none transition-opacity duration-700",
                    isLoaded ? "opacity-100" : "opacity-0"
                )}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => setIsLoaded(true)}
            />

            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-background-secondary animate-pulse">
                    <div className="w-12 h-12 rounded-full border-2 border-accent-cyan/30 border-t-accent-cyan animate-spin" />
                </div>
            )}
            
            {/* Enterprise Protection Watermark (Optional) */}
            <div className="absolute bottom-4 right-4 z-20 opacity-20 pointer-events-none select-none">
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Protected by SmartLMS Enterprise</span>
            </div>
        </div>
    );
}
