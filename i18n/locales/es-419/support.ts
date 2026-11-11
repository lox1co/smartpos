import type { LocaleShape } from "@/i18n/types";

export const support: LocaleShape["support"] = {
  about: {
    title: "Acerca de SmartPOS",
    version: "Versión 1.0.0",
    tagline: "Punto de Venta y Gestión Comercial Moderna",
    developerInfo: "Información del Desarrollador",
    keyFeatures: "Funcionalidades Clave",
    getInTouch: "Contacto",
    madeWith: "Hecho con ❤️ por Loxico",
    labels: {
      developer: "Desarrollador",
      framework: "Framework",
      database: "Base de Datos",
      auth: "Autenticación",
      license: "Licencia",
    },
    features: {
      fastBilling: "Cobro POS Rápido",
      inventoryTracking: "Control de Inventario",
      khataBook: "Libro de Cuentas / Fiados",
      gstReports: "Reportes de Impuestos",
      thermalPrinting: "Impresión Térmica",
      offlineMode: "Modo Offline",
      multiUser: "Roles de Usuario",
      bulkImport: "Importación Masiva",
    },
  },
  faq: {
    title: "Preguntas Frecuentes y Ayuda",
    banner:
      "Encuentra respuestas a las consultas más habituales sobre SmartPOS.",
    stillQuestions: "¿Aún tienes dudas? Contacta con Soporte",
    items: {
      addProductQ: "¿Cómo agrego un nuevo producto?",
      addProductA:
        "Ve a la pestaña Productos y pulsa el botón + arriba a la derecha. Completa el nombre, código SKU, precio, costo, stock, categoría e impuesto, y pulsa Guardar.",
      offlineBillingQ: "¿Cómo funciona la venta sin internet?",
      offlineBillingA:
        "Si se corta la conexión durante una venta, SmartPOS la guarda localmente con un número de factura local. Al reconectarte, se sincronizan todas las ventas pendientes de forma automática.",
      storeIdQ: "¿Qué es el ID de Tienda / Código de Acceso?",
      storeIdA:
        "Cada tienda recibe un código único alfanumérico. Tus empleados pueden ingresar este código al registrarse para unirse como cajeros o encargados.",
      khataQ: "¿Cómo registro una venta a crédito / fiado?",
      khataA:
        'Al cobrar, selecciona "Libro de Crédito" como método de pago e ingresa el nombre del cliente. El saldo adeudado se suma automáticamente a su cuenta corriente.',
      printQ: "¿Cómo imprimo un recibo?",
      printA:
        'Al completar un cobro se muestra la vista previa. Pulsa "Imprimir" para enviarlo a una impresora térmica Bluetooth o de red (58mm/80mm). También puedes exportarlo en PDF.',
      bulkImportQ: "¿Cómo importo productos masivamente?",
      bulkImportA:
        "En Productos, pulsa el icono de importación, descarga la plantilla de Excel, llénala con tu catálogo y súbela nuevamente. El sistema procesará las filas automáticamente.",
      barcodesQ: "¿Cómo escaneo códigos de barras rápidamente en la plantilla?",
      barcodesA:
        'Puedes dejar la columna SKU vacía para que se generen automáticamente, o usar apps móviles como "Barcode to PC" para escanear directo a Excel en tu computadora.',
      multiStaffQ: "¿Pueden varios empleados usar la misma tienda?",
      multiStaffA:
        "Sí. Comparte tu ID de tienda con tu equipo. Cada uno crea su cuenta con sus credenciales y accede con el rol que le corresponda.",
      gstCalcQ: "¿Cómo se calculan los impuestos?",
      gstCalcA:
        "Cada producto tiene una tasa impositiva %. En el cobro se desglosa el impuesto según la normativa tributaria y se refleja en los reportes.",
      restockQ: "¿Cómo reabastezco stock de un producto?",
      restockA:
        "En la pestaña Inventario busca el producto, pulsa el botón + y selecciona la cantidad deseada (+5, +10, +25, +50, +100). El stock se actualiza inmediatamente.",
      wrongDataQ: "¿Qué hago si veo información incorrecta?",
      wrongDataA:
        "Prueba cerrar sesión e ingresar nuevamente. Si el problema persiste, escribe a paolocuzcanogamboa@gmail.com con el detalle de la incidencia.",
    },
  },
  contact: {
    title: "Contacto y Soporte",
    bannerTitle: "Estamos para ayudarte",
    bannerSub:
      "Nuestro equipo de asistencia responde habitualmente en menos de 24 horas",
    reachUs: "Canales de Atención",
    emailTitle: "Soporte por Correo",
    emailHint: "Toca para abrir tu aplicación de correo",
    phoneTitle: "Soporte Telefónico",
    phoneHint: "Lun - Sáb, 9:00 AM - 7:00 PM",
    beforeContact: "Antes de contactarnos",
    storeIdReady: "Ten a mano tu ID de Tienda",
    storeIdBody:
      "Tu ID de Tienda es {{id}}. Tenerlo a mano nos permite identificar tu cuenta de inmediato.",
    checkFaq: "Consultar Preguntas Frecuentes",
  },
  privacy: {
    title: "Política de Privacidad",
    bannerTitle: "Tu Privacidad es Nuestra Prioridad",
    lastUpdated: "Última actualización: Septiembre 2025",
    sections: {
      s1Title: "1. Información que Recopilamos",
      s1Body:
        "SmartPOS recopila datos comerciales provistos durante el registro: nombre del negocio, nombre del titular, correo electrónico, teléfono y dirección comercial. Asimismo almacenamos el catálogo de productos, historial de transacciones, clientes y movimientos de crédito registrados en la app.",
      s2Title: "2. Uso de la Información",
      s2Body:
        "Toda la información se utiliza exclusivamente para operar el servicio SmartPOS: facturación, control de inventario, cuentas corrientes y reportes impositivos. No vendemos, alquilamos ni compartimos tus datos con terceros para fines comerciales.",
      s3Title: "3. Almacenamiento y Seguridad",
      s3Body:
        "Tus datos se resguardan en servidores en la nube seguros. Los tokens de autenticación se almacenan en el llavero seguro de tu dispositivo. Toda la comunicación API viaja cifrada mediante HTTPS.",
      s4Title: "4. Datos Sin Conexión",
      s4Body:
        "Al operar sin internet, los registros se guardan temporalmente en la base de datos local de tu dispositivo. Se sincronizan automáticamente con nuestros servidores al restablecer la conexión.",
      s5Title: "5. Aislamiento Multi-Inquilino",
      s5Body:
        "La información de cada tienda se encuentra estrictamente aislada. Los miembros de un comercio no tienen acceso a datos de otras tiendas. Dentro de cada comercio, el acceso está limitado según el rol del usuario.",
      s6Title: "6. Conservación de Datos",
      s6Body:
        "Conservamos tu información mientras tu cuenta permanezca activa. Si deseas dar de baja tu tienda o eliminar tu cuenta, contáctanos a paolocuzcanogamboa@gmail.com y procesaremos tu solicitud en 30 días.",
      s7Title: "7. Modificaciones a la Política",
      s7Body:
        "Podemos actualizar esta política periódicamente. Cualquier cambio relevante será informado en la app. El uso continuado del servicio implica la aceptación de los nuevos términos.",
      s8Title: "8. Contacto",
      s8Body:
        "Ante cualquier duda sobre tu privacidad o el tratamiento de datos, escribe a paolocuzcanogamboa@gmail.com.",
    },
  },
  terms: {
    title: "Términos y Condiciones",
    bannerTitle: "Términos y Condiciones",
    lastUpdated: "Última actualización: Septiembre 2025",
    sections: {
      s1Title: "1. Aceptación de los Términos",
      s1Body:
        "Al descargar, instalar o utilizar SmartPOS, aceptas cumplir con estos Términos y Condiciones. Si no estás de acuerdo, te solicitamos abstenerte de utilizar la aplicación.",
      s2Title: "2. Licencia de Uso",
      s2Body:
        "Loxico te otorga una licencia limitada, no exclusiva, intransferible y revocable para utilizar SmartPOS con fines comerciales personales o de tu empresa. No está permitido duplicar, modificar, distribuir ni revender ninguna parte del software.",
      s3Title: "3. Responsabilidad del Usuario",
      s3Body:
        "Eres responsable de proteger la confidencialidad de tus credenciales de acceso y de toda la actividad que ocurra en tu cuenta.",
      s4Title: "4. Uso Aceptable",
      s4Body:
        "Te comprometes a utilizar SmartPOS únicamente para actividades comerciales lícitas. Queda prohibido el uso de la plataforma para transacciones fraudulentas o evasión fiscal.",
      s5Title: "5. Exactitud de la Información",
      s5Body:
        "Eres responsable exclusivo de la exactitud de los precios, tasas impositivas y registros ingresados. La plataforma no asume responsabilidad por desajustes tributarios derivados de datos erróneos.",
      s6Title: "6. Propiedad Intelectual",
      s6Body:
        "SmartPOS y sus marcas, diseños y código pertenecen a Loxico y se encuentran protegidos por las leyes de propiedad intelectual aplicables.",
      s7Title: "7. Disponibilidad del Servicio",
      s7Body:
        "Nos esforzamos por ofrecer máxima disponibilidad, pero el servicio puede experimentar interrupciones programadas por mantenimiento. La funcionalidad offline garantiza continuidad operativa en todo momento.",
      s8Title: "8. Limitación de Responsabilidad",
      s8Body:
        "Loxico no será responsable por daños indirectos, pérdida de ingresos o interrupción comercial derivada del uso del aplicativo.",
      s9Title: "9. Cancelación de Cuenta",
      s9Body:
        "Nos reservamos el derecho de suspender cuentas que infrinjan estos Términos. Puedes solicitar la baja de tu cuenta contactando a nuestro equipo de soporte.",
      s10Title: "10. Jurisdicción y Ley Aplicable",
      s10Body:
        "Estos Términos se rigen por la legislación comercial y de comercio electrónico aplicable, sujetándose a los tribunales competentes.",
      s11Title: "11. Consultas Legales",
      s11Body:
        "Para cualquier consulta relacionada con estos términos, contáctanos a paolocuzcanogamboa@gmail.com.",
    },
  },
};
