import type { LocaleShape } from '@/i18n/types';

export const auth: LocaleShape['auth'] = {
  login: {
    title: 'Bienvenido de nuevo',
    subtitle: 'Inicia sesión para gestionar tu tienda',
    emailOrUsername: 'Correo o Usuario',
    emailPlaceholder: 'Ingresa correo o usuario',
    password: 'Contraseña',
    passwordPlaceholder: 'Ingresa tu contraseña',
    forgotPassword: '¿Olvidaste tu contraseña?',
    forgotPasswordTitle: 'Restablecer Contraseña',
    forgotPasswordMessage:
      'Para restablecer tu contraseña, contacta al dueño o administrador. Ellos pueden actualizarla desde el perfil del personal.',
    noAccount: '¿No tienes una cuenta?',
    createAccount: 'Crear Cuenta',
    secureTitle: 'Seguro y Confiable',
    secureSubtitle: 'Tus datos están protegidos con nosotros',
    clearInput: 'Limpiar campo',
    hidePassword: 'Ocultar contraseña',
    showPassword: 'Ver contraseña',
    errorCredentials: 'Inicio de sesión fallido. Verifica tus credenciales.',
    errorConnection: 'No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.',
  },
};
