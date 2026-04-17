import { describe, expect, it } from 'vitest';
import { hasPermission } from './permissions';
import { PERMISSIONS } from '@/constants/permissions';

const admin = { id: '1', role: 'ADMIN' as const, tenantId: 't1' };
const instructor = { id: '2', role: 'INSTRUCTOR' as const, tenantId: 't1' };
const student = { id: '3', role: 'STUDENT' as const, tenantId: 't1' };

describe('rbac permission matrix', () => {
  it('grants tenant management to admin roles only', () => {
    expect(hasPermission(admin, PERMISSIONS.TENANT_MANAGE)).toBe(true);
    expect(
      hasPermission({ id: '1', role: 'SUPER_ADMIN', tenantId: 't1' }, PERMISSIONS.TENANT_MANAGE)
    ).toBe(true);
    expect(hasPermission(instructor, PERMISSIONS.TENANT_MANAGE)).toBe(false);
  });

  it('grants exam taking to student but not grading', () => {
    expect(hasPermission(student, PERMISSIONS.EXAM_TAKE)).toBe(true);
    expect(hasPermission(student, PERMISSIONS.EXAM_GRADE)).toBe(false);
  });

  it('scopes asset and billing permissions by role', () => {
    expect(hasPermission(student, PERMISSIONS.ASSET_DOWNLOAD)).toBe(true);
    expect(hasPermission(student, PERMISSIONS.ASSET_UPLOAD)).toBe(false);
    expect(hasPermission(instructor, PERMISSIONS.ASSET_UPLOAD)).toBe(true);
    expect(hasPermission(admin, PERMISSIONS.BILLING_VIEW)).toBe(true);
    expect(hasPermission(instructor, PERMISSIONS.BILLING_VIEW)).toBe(false);
  });

  it('allows messaging and AI for students where intended', () => {
    expect(hasPermission(student, PERMISSIONS.MESSAGE_DIRECT)).toBe(true);
    expect(hasPermission(student, PERMISSIONS.MESSAGE_BROADCAST)).toBe(false);
    expect(hasPermission(student, PERMISSIONS.AI_USE)).toBe(true);
    expect(hasPermission(student, PERMISSIONS.AI_ADMIN)).toBe(false);
  });

  it('grants grade override only to elevated roles', () => {
    expect(hasPermission(student, PERMISSIONS.GRADE_OVERRIDE)).toBe(false);
    expect(hasPermission(instructor, PERMISSIONS.GRADE_OVERRIDE)).toBe(false);
    expect(hasPermission(admin, PERMISSIONS.GRADE_OVERRIDE)).toBe(true);
  });
});
