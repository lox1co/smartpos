import type { LocaleShape } from '@/i18n/types';

export const common: LocaleShape['common'] = {
  actions: {
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    confirm: 'Confirmar',
    edit: 'Editar',
    copy: 'Copiar',
    copied: 'Copiado',
    signIn: 'Iniciar Sesión',
    signingIn: 'Iniciando sesión...',
    signOut: 'Cerrar Sesión',
    createAccount: 'Crear Cuenta',
    close: 'Cerrar',
    retry: 'Reintentar',
    ok: 'Aceptar',
  },
  status: {
    loading: 'Cargando...',
    success: 'Éxito',
    error: 'Error',
    synced: 'Sincronizado',
    pending: 'Pendiente',
  },
  validation: {
    required: 'Por favor complete todos los campos.',
    invalidEmail: 'Por favor ingrese un correo o usuario válido.',
    passwordTooShort: 'La contraseña debe tener al menos 6 caracteres.',
    genericError: 'Algo salió mal. Por favor intente de nuevo.',
  },
  navigation: {
    back: 'Atrás',
    home: 'Inicio',
    settings: 'Ajustes',
  },
};
