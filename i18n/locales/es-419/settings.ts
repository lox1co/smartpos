import type { LocaleShape } from '@/i18n/types';

export const settings: LocaleShape['settings'] = {
  header: {
    title: 'App y Hardware',
  },
  sections: {
    hardware: 'Hardware e Impresión',
    system: 'Sistema y Datos',
    account: 'Sesión de Cuenta',
  },
  hardware: {
    printerTitle: 'Impresora Térmica',
    autoPrintTitle: 'Impresión Automática',
    autoPrintSub: 'Imprimir automáticamente al cobrar',
  },
  system: {
    lowStockTitle: 'Alertas de Stock Bajo',
    lowStockSub: 'Recibir notificaciones cuando el inventario sea bajo',
    backupTitle: 'Copia de Seguridad y Restauración',
    backupSub: 'Último respaldo: {{date}}',
    languageTitle: 'Idioma del Sistema',
  },
  account: {
    signOut: 'Cerrar Sesión en este Dispositivo',
    version: 'SmartPOS v1.0.0 • Build 2026',
  },
  backup: {
    successTitle: 'Copia de Seguridad Exitosa',
    successMessage: '¡Respaldo creado!\nFecha: {{timestamp}}\nRegistros Exportados: {{count}} productos',
    failedTitle: 'Error en Copia de Seguridad',
    failedMessage: 'No se pudo generar la copia de seguridad.',
    restoreSuccessTitle: 'Restauración Exitosa',
    restoreSuccessMessage: 'Cantidades y productos sincronizados con el servidor.',
  },
};
