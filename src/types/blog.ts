/**
 * Types for blog posts and content
 */

export type CategoriasBlog =
  | 'guias'
  | 'salud'
  | 'legal'
  | 'legales'
  | 'familias'
  | 'emocional'
  | 'actividades'
  | 'nutricion'
  | 'noticias';

export interface Autor {
  nombre: string;
  avatar?: string;
  bio?: string;
}

export interface BlogPost {
  id: string;
  titulo: string;
  slug: string;
  extracto: string;
  contenido: string;
  imagenPortada: string;
  autor: Autor;
  categoria: CategoriasBlog;
  tags: string[];
  fechaPublicacion: string;
  tiempoLectura: number;
  publicado: boolean;
}
