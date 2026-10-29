export const settings = {
  header: {
    title: 'App & Hardware',
  },
  sections: {
    hardware: 'Hardware & Printing',
    system: 'System & Data',
    account: 'Account Session',
  },
  hardware: {
    printerTitle: 'Thermal Printer',
    autoPrintTitle: 'Auto-Print Receipts',
    autoPrintSub: 'Print automatically upon checkout',
  },
  system: {
    lowStockTitle: 'Low Stock Alerts',
    lowStockSub: 'Get notified when item inventory is low',
    backupTitle: 'Backup & Restore',
    backupSub: 'Last archive: {{date}}',
    languageTitle: 'System Language',
  },
  account: {
    signOut: 'Sign Out from Device',
    version: 'SmartPOS v1.0.0 • Build 2026',
  },
  backup: {
    successTitle: 'Backup Successful',
    successMessage: 'Database backup created!\nTimestamp: {{timestamp}}\nRecords Exported: {{count}} products',
    failedTitle: 'Backup Failed',
    failedMessage: 'Could not compile database backup.',
    restoreSuccessTitle: 'Restore Successful',
    restoreSuccessMessage: 'Product quantities and catalog schemas are synchronized with the server.',
  },
} as const;
