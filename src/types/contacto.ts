/**
 * Types for contact and consultation forms
 */

export interface ContactoFormData {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  asunto?: string;
  aceptaPoliticaPrivacidad: boolean;
}

export interface SolicitudConsultaFormData {
  /** Personal information */
  nombreFamiliar: string;
  emailFamiliar: string;
  telefonoFamiliar: string;
  parentesco: Parentesco;

  /** Senior details */
  nombreAdultoMayor: string;
  edadAdultoMayor: number;
  situacionActual: string;
  necesidadesCuidado: string[];
  movilidadReducida: boolean;
  deterioroCognitivo: boolean;

  /** Preferences */
  barrioPreferido?: string;
  presupuestoEstimado?: string;
  tiposCuidadoBuscados: string[];
  urgencia: Urgencia;

  /** Additional */
  obraSocial?: string;
  comentariosAdicionales?: string;
  aceptaPoliticaPrivacidad: boolean;
}

export type Parentesco =
  | 'hijo-a'
  | 'nieto-a'
  | 'sobrino-a'
  | 'conyuge'
  | 'hermano-a'
  | 'otro';

export type Urgencia =
  | 'inmediata'
  | 'proximas-semanas'
  | 'proximo-mes'
  | 'explorando-opciones';

export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  errors: FormFieldError[];
  generalError?: string;
}
