/**
 * Application route constants
 */

export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',

  // Student
  STUDENT_DASHBOARD: '/dashboard',
  STUDENT_COURSES: '/dashboard/courses',
  STUDENT_COURSE: (id: string) => `/dashboard/courses/${id}`,
  STUDENT_LIVE: '/dashboard/live',
  STUDENT_AI_CHAT: '/dashboard/ai-chat',
  STUDENT_PROFILE: '/dashboard/profile',

  // Instructor
  INSTRUCTOR_DASHBOARD: '/instructor/dashboard',
  INSTRUCTOR_COURSES: '/instructor/courses',
  INSTRUCTOR_COURSE: (id: string) => `/instructor/courses/${id}`,
  INSTRUCTOR_STUDENTS: '/instructor/students',

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_TENANTS: '/admin/tenants',
  ADMIN_USERS: '/admin/users',
} as const;

