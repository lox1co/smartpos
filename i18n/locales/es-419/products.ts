import type { LocaleShape } from '@/i18n/types';

export const products: LocaleShape['products'] = {
  catalog: {
    title: 'Catálogo de Productos',
    searchPlaceholder: 'Buscar productos o SKU...',
    allItems: 'Todos',
    sort: 'Ordenar',
  },
  add: {
    titleAdd: 'Agregar Producto',
    titleEdit: 'Editar Producto',
    save: 'Guardar Producto',
    saveChanges: 'Guardar Cambios',
    saving: 'Guardando...',
    delete: 'Eliminar',
    confirmDeleteTitle: 'Eliminar Producto',
    confirmDeleteMessage: '¿Estás seguro de que deseas eliminar "{{name}}"? Esta acción no se puede deshacer.',
    requiredFields: 'Por favor complete todos los campos requeridos marcados con *',
    invalidPrice: 'Ingrese un precio de venta válido mayor a {{symbol}}0.',
    invalidCost: 'El precio de costo debe ser un número válido no negativo.',
    invalidStock: 'El nivel de stock debe ser un número válido no negativo.',
    invalidLowStock: 'La alerta de stock bajo debe ser un número válido no negativo.',
    invalidTaxRate: 'Ingrese un porcentaje de impuesto válido (0-100).',
    skuExists: 'El SKU del producto ya existe en el catálogo.',
    saveFailed: 'Error al guardar el producto en la base de datos local.',
    deleteFailed: 'Error al eliminar el producto.',
  },
  scanner: {
    title: 'Escanear Código de Barras',
    permissionRequired: 'Se requiere permiso de cámara para escanear códigos de barras.',
    grantPermission: 'Conceder Permiso',
    notFoundTitle: 'Producto no encontrado',
    notFoundMessage: 'No se encontró ningún producto con el código {{sku}}',
    createProduct: 'Crear Producto',
    manualEntry: 'Entrada Manual',
    enterBarcode: 'Ingresa código de barras / SKU',
  },
};
