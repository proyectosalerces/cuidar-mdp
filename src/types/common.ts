/**
 * Shared / common types used across the application
 */

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface Breadcrumb {
  label: string;
  href?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  isExternal?: boolean;
}

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'whatsapp' | 'linkedin' | 'youtube';
  url: string;
  label: string;
}

export interface Testimonial {
  id: string;
  nombre: string;
  parentesco: string;
  residencia?: string;
  texto: string;
  calificacion: number;
  fecha: string;
  avatar?: string;
}

export interface FAQ {
  pregunta: string;
  respuesta: string;
}

export interface ImageData {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}
