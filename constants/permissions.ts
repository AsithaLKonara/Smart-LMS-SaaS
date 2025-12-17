/**
 * Permission constants for RBAC
 */

export const PERMISSIONS = {
  // Course permissions
  COURSE_CREATE: 'course:create',
  COURSE_EDIT: 'course:edit',
  COURSE_DELETE: 'course:delete',
  COURSE_VIEW: 'course:view',
  COURSE_PUBLISH: 'course:publish',

  // Student permissions
  STUDENT_MANAGE: 'student:manage',
  STUDENT_VIEW: 'student:view',

  // Exam permissions
  EXAM_CREATE: 'exam:create',
  EXAM_EDIT: 'exam:edit',
  EXAM_DELETE: 'exam:delete',
  EXAM_GRADE: 'exam:grade',
  EXAM_TAKE: 'exam:take',

  // Tenant permissions
  TENANT_MANAGE: 'tenant:manage',
  TENANT_VIEW: 'tenant:view',

  // User permissions
  USER_MANAGE: 'user:manage',
  USER_VIEW: 'user:view',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Role-based permission mapping
 */
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  SUPER_ADMIN: Object.values(PERMISSIONS),
  ADMIN: [
    PERMISSIONS.TENANT_MANAGE,
    PERMISSIONS.TENANT_VIEW,
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.USER_VIEW,
  ],
  INSTRUCTOR: [
    PERMISSIONS.COURSE_CREATE,
    PERMISSIONS.COURSE_EDIT,
    PERMISSIONS.COURSE_DELETE,
    PERMISSIONS.COURSE_VIEW,
    PERMISSIONS.COURSE_PUBLISH,
    PERMISSIONS.STUDENT_VIEW,
    PERMISSIONS.EXAM_CREATE,
    PERMISSIONS.EXAM_EDIT,
    PERMISSIONS.EXAM_DELETE,
    PERMISSIONS.EXAM_GRADE,
  ],
  STUDENT: [
    PERMISSIONS.COURSE_VIEW,
    PERMISSIONS.EXAM_TAKE,
  ],
};

