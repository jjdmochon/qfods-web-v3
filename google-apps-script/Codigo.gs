/**
 * QFDOS · Recepción de entregas de prácticas
 * Química Farmacéutica II — Universidad de Granada
 *
 * Este script recibe los datos que envía la plataforma y los escribe en la
 * hoja de cálculo del profesor, creando una pestaña por tipo de entrega y
 * añadiendo las columnas nuevas que vayan apareciendo.
 *
 * ---------------------------------------------------------------------------
 * CÓMO DESPLEGARLO (una sola vez, ~3 minutos)
 * ---------------------------------------------------------------------------
 *  1. Abre la hoja de cálculo:
 *     https://docs.google.com/spreadsheets/d/1RrMzWJPFOKKH76vJh70pQw9vbiQZNOGOJH7vNaTGkso
 *  2. Menú  Extensiones → Apps Script
 *  3. Borra el contenido de Código.gs y pega ESTE fichero entero. Guarda.
 *  4. Botón azul  Implementar → Nueva implementación
 *       · Tipo:            Aplicación web
 *       · Ejecutar como:   Yo (tu cuenta)
 *       · Quién tiene acceso: CUALQUIER USUARIO   ← imprescindible
 *  5. Implementar. Google pedirá autorización: acéptala
 *     (en «Configuración avanzada» → «Ir a … (no seguro)», es tu propio script).
 *  6. Copia la URL que termina en /exec y pégala en el fichero .env.local
 *     del proyecto:
 *
 *        VITE_PRACTICAS_WEBAPP_URL=https://script.google.com/macros/s/AKfy…/exec
 *
 *  7. Reinicia el servidor de desarrollo.
 *
 * Comprobación rápida: abre la URL /exec en el navegador. Debe responder
 * {"ok":true,"servicio":"QFDOS"} — si pide iniciar sesión, el paso 4 quedó
 * como «Solo yo» y hay que volver a implementar con «Cualquier usuario».
 * ---------------------------------------------------------------------------
 */

var HOJA_ID = '1RrMzWJPFOKKH76vJh70pQw9vbiQZNOGOJH7vNaTGkso';

function doGet(e) {
  return manejar(e);
}

function doPost(e) {
  return manejar(e);
}

function manejar(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};

    // Sin parámetros: sirve de comprobación de que el despliegue funciona
    if (!p.sheetName) {
      return json({ ok: true, servicio: 'QFDOS', mensaje: 'Endpoint operativo.' });
    }

    var libro = SpreadsheetApp.openById(p.sheetId || HOJA_ID);
    var hoja = libro.getSheetByName(p.sheetName) || libro.insertSheet(p.sheetName);

    // Los campos de control no son datos de la entrega
    var datos = {};
    Object.keys(p).forEach(function (k) {
      if (k !== 'sheetId' && k !== 'sheetName' && k !== 'callback') datos[k] = p[k];
    });

    // Marca de tiempo del servidor: no depende del reloj del alumno
    datos.recibidoEn = new Date();

    var cabeceras = leerCabeceras(hoja);

    // Toda clave nueva se añade como columna, para no perder datos si el
    // formulario de la plataforma crece más adelante
    Object.keys(datos).forEach(function (k) {
      if (cabeceras.indexOf(k) === -1) cabeceras.push(k);
    });
    hoja.getRange(1, 1, 1, cabeceras.length).setValues([cabeceras]);
    hoja.getRange(1, 1, 1, cabeceras.length).setFontWeight('bold');
    hoja.setFrozenRows(1);

    var fila = cabeceras.map(function (c) {
      return datos[c] !== undefined ? datos[c] : '';
    });
    hoja.appendRow(fila);

    return json({
      ok: true,
      hoja: p.sheetName,
      fila: hoja.getLastRow(),
      recibidoEn: datos.recibidoEn.toISOString()
    });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function leerCabeceras(hoja) {
  if (hoja.getLastRow() === 0 || hoja.getLastColumn() === 0) return [];
  return hoja.getRange(1, 1, 1, hoja.getLastColumn())
             .getValues()[0]
             .filter(String);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
