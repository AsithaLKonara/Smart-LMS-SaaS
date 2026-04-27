'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';
import { 
  File, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Archive, 
  MoreVertical,
  Download,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Asset {
  id: string;
  name: string;
  type: string;
  url: string;
  sizeBytes: number | null;
  scormVersion?: string | null;
  createdAt: Date | string;
}

interface AssetGridProps {
  assets: Asset[];
  onDelete?: (id: string) => void;
}

export function AssetGrid({ assets, onDelete }: AssetGridProps) {
  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'image': return <ImageIcon className="w-8 h-8 text-accent-purple" />;
      case 'video': return <Video className="w-8 h-8 text-accent-cyan" />;
      case 'document': return <FileText className="w-8 h-8 text-accent-blue" />;
      case 'scorm': return <Archive className="w-8 h-8 text-yellow-500" />;
      default: return <File className="w-8 h-8 text-text-secondary" />;
    }
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {assets.map((asset) => (
        <Card key={asset.id} variant="glass" interactive className="group relative overflow-hidden">
          <CardContent className="p-4">
            <div className="flex flex-col items-center justify-center py-6 bg-white/5 rounded-xl mb-4 border border-white/5 group-hover:bg-white/10 transition-colors">
              {getIcon(asset.type)}
              {asset.scormVersion && (
                <span className="mt-2 text-[10px] font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full">
                  SCORM {asset.scormVersion}
                </span>
              )}
            </div>
            
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-sm font-semibold text-text-primary truncate flex-1 pr-2">
                {asset.name}
              </h4>
              <button className="text-text-secondary hover:text-text-primary transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex justify-between items-center text-[11px] text-text-secondary">
              <span>{formatSize(asset.sizeBytes)}</span>
              <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-[10px] h-8 bg-white/5 border-white/10"
                asChild
              >
                <a href={asset.url} target="_blank" rel="noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1" /> View
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 text-[10px] h-8 bg-white/5 border-white/10"
              >
                <Download className="w-3 h-3 mr-1" /> Get
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
