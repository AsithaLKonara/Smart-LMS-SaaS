/**
 * App-wide constants
 */

export const APP_NAME = 'Smart LMS SaaS';
export const APP_DESCRIPTION = 'AI-Powered Smart Learning Management System';

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Date Formats
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATETIME_FORMAT = 'MMM dd, yyyy HH:mm';

// Animation Durations (ms)
export const ANIMATION_FAST = 150;
export const ANIMATION_NORMAL = 200;
export const ANIMATION_SLOW = 300;

