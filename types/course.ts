/**
 * Course related types
 */

export type CourseStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Course {
  id: string;
  tenantId: string;
  instructorId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  status: CourseStatus;
  createdAt: Date;
  updatedAt: Date;
}

