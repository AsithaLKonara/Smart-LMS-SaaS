/**
 * User related types
 */

export interface User {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

