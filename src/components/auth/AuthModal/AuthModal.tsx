'use client';

/**
 * AuthModal — Modal de autenticación premium con tabs login / registro.
 *
 * Utiliza los componentes Input y Button existentes.
 * Cierra con Escape, click en backdrop, o botón X.
 * Bloquea el scroll del body mientras está abierto.
 */

import { useState, useCallback, useEffect, type FormEvent } from 'react';
import { cn } from '@/utils/classnames';
import { isValidEmail, hasMinLength, isRequired } from '@/utils/validators';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/ui/Input/Input';
import Button from '@/components/ui/Button/Button';
import styles from './AuthModal.module.css';

/* ── Types ─────────────────────────────────────────────────────────────── */

type TabKey = 'login' | 'register';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: TabKey;
}

/* ── Component ─────────────────────────────────────────────────────────── */

export default function AuthModal({
  isOpen,
  onClose,
  defaultTab = 'login',
}: AuthModalProps) {
  const { login, register } = useAuth();

  const [activeTab, setActiveTab] = useState<TabKey>(defaultTab);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  /* ── Form fields ────────────────────────────────────────────────────── */

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regNombre, setRegNombre] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [forgotMsg, setForgotMsg] = useState(false);

  /* ── Field-level errors ─────────────────────────────────────────────── */

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  /* ── Reset state on tab change / open ───────────────────────────────── */

  const resetForm = useCallback(() => {
    setError('');
    setSuccess(false);
    setFieldErrors({});
    setLoginEmail('');
    setLoginPassword('');
    setRegNombre('');
    setRegEmail('');
    setRegPassword('');
    setRegConfirm('');
    setForgotMsg(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      resetForm();
    }
  }, [isOpen, defaultTab, resetForm]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setError('');
    setSuccess(false);
    setFieldErrors({});
    setForgotMsg(false);
  };

  /* ── Body scroll lock ───────────────────────────────────────────────── */

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  /* ── Escape key close ───────────────────────────────────────────────── */

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  /* ── Auto-close on success ──────────────────────────────────────────── */

  useEffect(() => {
    if (!success) return;
    const timer = setTimeout(() => {
      onClose();
    }, 500);
    return () => clearTimeout(timer);
  }, [success, onClose]);

  /* ── Validation ──────────────────────────────────────────────────────── */

  function validateLogin(): boolean {
    const errors: Record<string, string> = {};
    if (!isRequired(loginEmail)) {
      errors.loginEmail = 'El email es obligatorio.';
    } else if (!isValidEmail(loginEmail)) {
      errors.loginEmail = 'Ingresá un email válido.';
    }
    if (!isRequired(loginPassword)) {
      errors.loginPassword = 'La contraseña es obligatoria.';
    } else if (!hasMinLength(loginPassword, 6)) {
      errors.loginPassword = 'Mínimo 6 caracteres.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function validateRegister(): boolean {
    const errors: Record<string, string> = {};
    if (!isRequired(regNombre)) {
      errors.regNombre = 'El nombre es obligatorio.';
    }
    if (!isRequired(regEmail)) {
      errors.regEmail = 'El email es obligatorio.';
    } else if (!isValidEmail(regEmail)) {
      errors.regEmail = 'Ingresá un email válido.';
    }
    if (!isRequired(regPassword)) {
      errors.regPassword = 'La contraseña es obligatoria.';
    } else if (!hasMinLength(regPassword, 6)) {
      errors.regPassword = 'Mínimo 6 caracteres.';
    }
    if (!isRequired(regConfirm)) {
      errors.regConfirm = 'Confirmá tu contraseña.';
    } else if (regPassword !== regConfirm) {
      errors.regConfirm = 'Las contraseñas no coinciden.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  /* ── Handlers ────────────────────────────────────────────────────────── */

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setSubmitting(true);
    setError('');
    const result = await login(loginEmail, loginPassword);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;
    setSubmitting(true);
    setError('');
    const result = await register(regEmail, regPassword, regNombre);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  };

  /* ── Render ──────────────────────────────────────────────────────────── */

  return (
    <div
      className={cn(styles.overlay, isOpen && styles.overlayOpen)}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-modal={isOpen}
      role="dialog"
      aria-label="Autenticación"
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Cerrar"
          type="button"
        >
          ✕
        </button>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoMark} aria-hidden="true">C</div>
          <h2 className={styles.title}>
            {activeTab === 'login' ? 'Bienvenido de nuevo' : 'Creá tu cuenta'}
          </h2>
          <p className={styles.subtitle}>
            {activeTab === 'login'
              ? 'Iniciá sesión para acceder a tu cuenta'
              : 'Registrate para dejar reseñas y más'}
          </p>
        </div>

        {/* Tabs */}
        <div className={styles.tabs} role="tablist">
          <button
            className={cn(styles.tab, activeTab === 'login' && styles.tabActive)}
            onClick={() => handleTabChange('login')}
            role="tab"
            aria-selected={activeTab === 'login'}
            type="button"
          >
            Iniciar sesión
          </button>
          <button
            className={cn(styles.tab, activeTab === 'register' && styles.tabActive)}
            onClick={() => handleTabChange('register')}
            role="tab"
            aria-selected={activeTab === 'register'}
            type="button"
          >
            Crear cuenta
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Success message */}
          {success && (
            <div className={styles.successMessage}>
              <span>✓</span>
              {activeTab === 'login' ? '¡Sesión iniciada!' : '¡Cuenta creada con éxito!'}
            </div>
          )}

          {/* Error alert */}
          {error && !success && (
            <div className={styles.errorAlert} role="alert">
              <span className={styles.errorIcon}>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Login form */}
          {activeTab === 'login' && !success && (
            <form className={styles.form} onSubmit={handleLoginSubmit} noValidate>
              <Input
                label="Email"
                type="email"
                placeholder="tu@email.com"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                error={fieldErrors.loginEmail}
                autoComplete="email"
              />
              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                error={fieldErrors.loginPassword}
                autoComplete="current-password"
              />

              <button
                className={styles.forgotLink}
                type="button"
                onClick={() => setForgotMsg(true)}
              >
                ¿Olvidaste tu contraseña?
              </button>

              {forgotMsg && (
                <p style={{ fontSize: 'var(--font-xs, 0.75rem)', color: 'var(--color-neutral-500)', margin: 0 }}>
                  🔒 Recuperación de contraseña — Próximamente
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={submitting}
                disabled={submitting}
              >
                Iniciar sesión
              </Button>
            </form>
          )}

          {/* Register form */}
          {activeTab === 'register' && !success && (
            <form className={styles.form} onSubmit={handleRegisterSubmit} noValidate>
              <Input
                label="Nombre"
                type="text"
                placeholder="Tu nombre completo"
                required
                value={regNombre}
                onChange={(e) => setRegNombre(e.target.value)}
                error={fieldErrors.regNombre}
                autoComplete="name"
              />
              <Input
                label="Email"
                type="email"
                placeholder="tu@email.com"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                error={fieldErrors.regEmail}
                autoComplete="email"
              />
              <Input
                label="Contraseña"
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                error={fieldErrors.regPassword}
                autoComplete="new-password"
              />
              <Input
                label="Confirmar contraseña"
                type="password"
                placeholder="Repetí tu contraseña"
                required
                value={regConfirm}
                onChange={(e) => setRegConfirm(e.target.value)}
                error={fieldErrors.regConfirm}
                autoComplete="new-password"
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={submitting}
                disabled={submitting}
              >
                Crear cuenta
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
