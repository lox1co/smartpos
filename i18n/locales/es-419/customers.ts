import type { LocaleShape } from '@/i18n/types';

export const customers: LocaleShape['customers'] = {
  header: {
    title: 'Clientes y Créditos',
  },
  totalBanner: {
    label: 'Saldo Total Pendiente (Por Cobrar)',
  },
  search: {
    placeholder: 'Buscar cliente por nombre o teléfono...',
  },
  empty: {
    noCustomers: 'No se encontraron clientes',
  },
  alerts: {
    customerAddedTitle: 'Cliente Agregado',
    customerAddedMessage: '{{name}} ha sido agregado a los clientes.',
    addErrorTitle: 'Error',
    addErrorMessage: 'No se pudo agregar al cliente.',
    paymentRecordedTitle: 'Pago Registrado',
    paymentRecordedMessage: 'Se registró un abono de {{amount}} de {{name}}.',
    paymentErrorTitle: 'Error',
    paymentErrorMessage: 'No se pudo registrar el pago del cliente.',
  },
  card: {
    outstanding: 'Pendiente',
    settled: 'Al día',
  },
  addModal: {
    title: 'Agregar Nuevo Cliente',
    nameLabel: 'Nombre del Cliente *',
    namePlaceholder: 'ej. Juan Pérez',
    phoneLabel: 'Número de Teléfono',
    phonePlaceholder: 'ej. +1 555-0199',
    submit: 'Agregar Cliente',
    submitting: 'Agregando...',
    validationErrorTitle: 'Error de Validación',
    validationErrorMessage: 'El nombre del cliente es obligatorio.',
  },
  ledgerModal: {
    balanceLabel: 'Saldo Pendiente Actual',
    sectionTitle: 'Libro de Movimientos',
    emptyList: 'No hay movimientos registrados',
    paymentRepayment: 'Abono / Pago',
    boughtOnCredit: 'Compra a Crédito',
    payAmountPlaceholder: 'Importe de Pago (ej. 50.00)',
    payNotePlaceholder: 'Nota (opcional)',
    recordRepayment: 'Registrar Abono',
    recording: 'Registrando...',
    submitPay: 'Guardar Pago',
  },
};
