import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AssetType, AssetDownloadPolicy, ScormStatus } from '@prisma/client';
import { guardPermission } from '@/lib/auth/api-permission';
import { PERMISSIONS } from '@/constants/permissions';
import { createAsset, getAssetsForViewer } from '@/lib/db/queries/assets';

const createAssetSchema = z.object({
  name: z.string().min(2),
  url: z.string().url(),
  type: z.nativeEnum(AssetType).optional(),
  courseId: z.string().optional(),
  parentFolderId: z.string().optional(),
  downloadPolicy: z.nativeEnum(AssetDownloadPolicy).optional(),
  sizeBytes: z.number().int().positive().optional(),
  tags: z.array(z.string()).optional(),
  scormVersion: z.string().optional(),
  scormStatus: z.nativeEnum(ScormStatus).optional(),
});

export async function GET(request: NextRequest) {
  const g = await guardPermission(PERMISSIONS.ASSET_DOWNLOAD);
  if (!g.ok) return g.response;

  try {
    const typeParam = request.nextUrl.searchParams.get('type');
    const type = typeParam && typeParam in AssetType ? (typeParam as AssetType) : undefined;
    const assets = await getAssetsForViewer(g.user.tenantId, { id: g.user.id, role: g.user.role }, type);
    return NextResponse.json({ success: true, data: assets });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unable to fetch assets' },
      { status: 401 }
    );
  }
}

export async function POST(request: NextRequest) {
  const g = await guardPermission(PERMISSIONS.ASSET_UPLOAD);
  if (!g.ok) return g.response;

  try {
    const payload = createAssetSchema.parse(await request.json());
    const asset = await createAsset({
      tenantId: g.user.tenantId,
      uploadedById: g.user.id,
      ...payload,
    });
    return NextResponse.json({ success: true, data: asset }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unable to create asset' },
      { status: 400 }
    );
  }
}
