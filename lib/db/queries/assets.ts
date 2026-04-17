import { prisma } from '../prisma';
import { AssetType, AssetDownloadPolicy, ScormStatus, RoleType } from '@prisma/client';

export async function getAssetsByTenant(tenantId: string, type?: AssetType) {
  return prisma.asset.findMany({
    where: {
      tenantId,
      ...(type ? { type } : {}),
    },
    include: {
      uploadedBy: {
        select: { id: true, name: true, email: true },
      },
      course: {
        select: { id: true, title: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

function staffRole(role: RoleType) {
  return role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'INSTRUCTOR';
}

function assetVisibleToViewer(
  a: { downloadPolicy: AssetDownloadPolicy; courseId: string | null },
  enrolledCourseIds: Set<string>,
  role: RoleType
) {
  if (staffRole(role)) return true;
  if (a.downloadPolicy === 'PUBLIC_WITHIN_TENANT') return true;
  if (a.downloadPolicy === 'TENANT_STAFF') return false;
  if (a.downloadPolicy === 'COURSE_ENROLLED') {
    return a.courseId ? enrolledCourseIds.has(a.courseId) : false;
  }
  return false;
}

/** Tenant assets filtered by download policy for the viewer. */
export async function getAssetsForViewer(
  tenantId: string,
  viewer: { id: string; role: RoleType },
  type?: AssetType
) {
  const rows = await getAssetsByTenant(tenantId, type);
  if (staffRole(viewer.role)) return rows;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: viewer.id, course: { tenantId } },
    select: { courseId: true },
  });
  const enrolled = new Set(enrollments.map((e) => e.courseId));

  return rows.filter((a) => assetVisibleToViewer(a, enrolled, viewer.role));
}

export async function createAsset(data: {
  tenantId: string;
  uploadedById: string;
  name: string;
  url: string;
  courseId?: string;
  parentFolderId?: string;
  type?: AssetType;
  sizeBytes?: number;
  tags?: string[];
  scormVersion?: string;
  scormStatus?: ScormStatus;
  downloadPolicy?: AssetDownloadPolicy;
}) {
  if (data.courseId) {
    const course = await prisma.course.findFirst({
      where: { id: data.courseId, tenantId: data.tenantId },
      select: { id: true },
    });
    if (!course) {
      throw new Error('Course not found in tenant');
    }
  }

  if (data.parentFolderId) {
    const folder = await prisma.asset.findFirst({
      where: { id: data.parentFolderId, tenantId: data.tenantId },
      select: { id: true },
    });
    if (!folder) throw new Error('Folder not found in tenant');
  }

  return prisma.asset.create({
    data: {
      tenantId: data.tenantId,
      uploadedById: data.uploadedById,
      name: data.name,
      url: data.url,
      courseId: data.courseId,
      parentFolderId: data.parentFolderId,
      type: data.type ?? AssetType.OTHER,
      sizeBytes: data.sizeBytes,
      tags: data.tags ?? [],
      scormVersion: data.scormVersion,
      scormStatus: data.scormStatus,
      downloadPolicy: data.downloadPolicy,
    },
  });
}
