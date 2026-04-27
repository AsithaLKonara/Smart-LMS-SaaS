import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/config';
import { getAssetsByTenant } from '@/lib/db/queries/assets';
import { AssetGrid } from '@/components/features/assets/AssetGrid';
import { Button } from '@/components/ui/Button';
import { Upload, FolderPlus, Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default async function AssetLibraryPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  if (!['SUPER_ADMIN', 'ADMIN', 'INSTRUCTOR'].includes(session.user.role)) {
    redirect('/dashboard');
  }

  const assets = await getAssetsByTenant(session.user.tenantId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-text-primary">Asset Library</h1>
          <p className="text-text-secondary mt-2">Centralized management for course media and SCORM content.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10">
            <FolderPlus className="w-4 h-4 mr-2" /> New Folder
          </Button>
          <Button className="bg-accent-purple hover:bg-accent-purple/80 shadow-lg shadow-accent-purple/20">
            <Upload className="w-4 h-4 mr-2" /> Upload File
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input 
            placeholder="Search assets by name or tag..." 
            className="pl-10 bg-transparent border-none focus-visible:ring-0"
          />
        </div>
        <div className="h-6 w-[1px] bg-white/10" />
        <select className="bg-transparent text-sm text-text-secondary outline-none cursor-pointer">
          <option>All Types</option>
          <option>Images</option>
          <option>Videos</option>
          <option>Documents</option>
          <option>SCORM</option>
        </select>
      </div>

      {assets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-text-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary">No assets yet</h3>
          <p className="text-sm text-text-secondary mt-1 max-w-xs">
            Start building your library by uploading course materials, images, or SCORM packages.
          </p>
          <Button className="mt-6 bg-accent-purple">Upload First Asset</Button>
        </div>
      ) : (
        <AssetGrid assets={assets} />
      )}
    </div>
  );
}
