import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/config';
import { getAssetsByTenant } from '@/lib/db/queries/assets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default async function AssetLibraryPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  if (!['SUPER_ADMIN', 'ADMIN', 'INSTRUCTOR'].includes(session.user.role)) {
    redirect('/dashboard');
  }

  const assets = await getAssetsByTenant(session.user.tenantId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-text-primary">Asset Library</h1>
        <p className="text-text-secondary mt-2">Manage media, files, and SCORM packages for your academy.</p>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Assets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {assets.length === 0 ? (
            <p className="text-sm text-text-secondary">No assets found. Upload your first file from course creation tools.</p>
          ) : (
            assets.map((asset) => (
              <div key={asset.id} className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text-primary">{asset.name}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    {asset.type} {asset.scormVersion ? `· SCORM ${asset.scormVersion}` : ''}
                  </p>
                </div>
                <a href={asset.url} target="_blank" rel="noreferrer" className="text-xs text-accent-cyan hover:underline">
                  Open
                </a>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
