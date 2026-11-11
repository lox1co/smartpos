export const customers = {
  header: {
    title: 'Customers & Khata',
  },
  totalBanner: {
    label: 'Total Outstanding Balance (Owed)',
  },
  search: {
    placeholder: 'Search customer by name or phone...',
  },
  empty: {
    noCustomers: 'No customers found',
  },
  alerts: {
    customerAddedTitle: 'Customer Added',
    customerAddedMessage: '{{name}} has been added to customers.',
    addErrorTitle: 'Error',
    addErrorMessage: 'Failed to add customer.',
    paymentRecordedTitle: 'Payment Recorded',
    paymentRecordedMessage: 'Recorded {{amount}} repayment from {{name}}.',
    paymentErrorTitle: 'Error',
    paymentErrorMessage: 'Failed to record customer repayment.',
  },
  card: {
    outstanding: 'Outstanding',
    settled: 'Settled',
  },
  addModal: {
    title: 'Add New Customer',
    nameLabel: 'Customer Name *',
    namePlaceholder: 'e.g. John Doe',
    phoneLabel: 'Phone Number',
    phonePlaceholder: 'e.g. +1 555-0199',
    submit: 'Add Customer',
    submitting: 'Adding...',
    validationErrorTitle: 'Validation Error',
    validationErrorMessage: 'Customer name is required.',
  },
  ledgerModal: {
    balanceLabel: 'Current Outstanding Balance',
    sectionTitle: 'Transaction Ledger',
    emptyList: 'No credit entries recorded',
    paymentRepayment: 'Payment / Repayment',
    boughtOnCredit: 'Bought on Credit',
    payAmountPlaceholder: 'Payment Amount (e.g. 50.00)',
    payNotePlaceholder: 'Note (optional)',
    recordRepayment: 'Record Repayment',
    recording: 'Recording...',
    submitPay: 'Record Payment',
  },
} as const;
