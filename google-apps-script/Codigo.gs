/**
 * QFDOS · Recepción de entregas y publicación de contenido
 * Química Farmacéutica II — Universidad de Granada
 *
 * Hace tres cosas:
 *   1. Recibe entregas del alumnado y las anota en la hoja correspondiente.
 *   2. Guarda el contenido del curso que publica el profesor, para que sus
 *      cambios los vea todo el mundo y no sólo su navegador.
 *   3. Devuelve a cada estudiante lo que él mismo ha entregado.
 *
 * ---------------------------------------------------------------------------
 * DESPLIEGUE
 * ---------------------------------------------------------------------------
 *  1. Hoja: https://docs.google.com/spreadsheets/d/1RrMzWJPFOKKH76vJh70pQw9vbiQZNOGOJH7vNaTGkso
 *  2. Extensiones → Apps Script. Pega este fichero entero y guarda.
 *  3. CAMBIA la constante CLAVE_PUBLICACION de abajo por una tuya.
 *  4. Implementar → Nueva implementación → Aplicación web
 *       · Ejecutar como:       Yo
 *       · Quién tiene acceso:  CUALQUIER USUARIO
 *  5. Copia la URL /exec en .env.local (VITE_PRACTICAS_WEBAPP_URL).
 *
 * IMPORTANTE: al editar este script, guardar NO basta. Hay que crear una
 * IMPLEMENTACIÓN NUEVA, o la URL seguirá sirviendo la versión anterior.
 * ---------------------------------------------------------------------------
 */

var HOJA_ID = '1RrMzWJPFOKKH76vJh70pQw9vbiQZNOGOJH7vNaTGkso';

/**
 * Clave que autoriza a publicar contenido del curso.
 *
 * Sin ella, cualquiera que abriese las herramientas del navegador podría
 * reescribir el temario de todos. No se guarda en el código de la web: el
 * profesor la teclea una vez y queda en SU navegador.
 *
 * CÁMBIALA por una tuya antes de desplegar.
 */
var CLAVE_PUBLICACION = 'cambia-esta-clave-2627';

/** Pestaña donde vive el contenido publicado. */
var HOJA_CONTENIDO = '_Contenido';

function doGet(e)  { return manejar(e); }
function doPost(e) { return manejar(e); }

function manejar(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};
    var accion = p.accion || '';

    if (accion === 'leerContenido')   return leerContenido();
    if (accion === 'guardarContenido') return guardarContenido(p, e);
    if (accion === 'misEntregas')      return misEntregas(p);

    if (!p.sheetName) {
      return json({
        ok: true,
        servicio: 'QFDOS',
        version: 2,
        acciones: ['leerContenido', 'guardarContenido', 'misEntregas'],
        mensaje: 'Endpoint operativo.'
      });
    }
    return anotarFila(p);
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

/* ------------------------------------------------------------------ */
/* 1. Entregas                                                         */
/* ------------------------------------------------------------------ */

function anotarFila(p) {
  var libro = SpreadsheetApp.openById(p.sheetId || HOJA_ID);
  var hoja = libro.getSheetByName(p.sheetName) || libro.insertSheet(p.sheetName);

  var datos = {};
  Object.keys(p).forEach(function (k) {
    if (k !== 'sheetId' && k !== 'sheetName' && k !== 'callback' && k !== 'accion') {
      datos[k] = p[k];
    }
  });
  datos.recibidoEn = new Date();

  var cabeceras = leerCabeceras(hoja);
  Object.keys(datos).forEach(function (k) {
    if (cabeceras.indexOf(k) === -1) cabeceras.push(k);
  });
  hoja.getRange(1, 1, 1, cabeceras.length).setValues([cabeceras]).setFontWeight('bold');
  hoja.setFrozenRows(1);

  hoja.appendRow(cabeceras.map(function (c) {
    return datos[c] !== undefined ? datos[c] : '';
  }));

  return json({
    ok: true,
    hoja: p.sheetName,
    fila: hoja.getLastRow(),
    recibidoEn: datos.recibidoEn.toISOString()
  });
}

/* ------------------------------------------------------------------ */
/* 2. Contenido del curso                                              */
/* ------------------------------------------------------------------ */

/**
 * El contenido se guarda por trozos porque una celda admite 50 000
 * caracteres y el temario completo los supera con holgura.
 */
function guardarContenido(p, e) {
  if (p.clave !== CLAVE_PUBLICACION) {
    return json({ ok: false, error: 'Clave de publicación incorrecta.' });
  }

  // El contenido llega por POST: en la URL no cabría
  var cuerpo = (e && e.postData && e.postData.contents) ? e.postData.contents : (p.datos || '');
  if (!cuerpo) return json({ ok: false, error: 'No se recibió contenido.' });

  var libro = SpreadsheetApp.openById(HOJA_ID);
  var hoja = libro.getSheetByName(HOJA_CONTENIDO);
  if (hoja) { libro.deleteSheet(hoja); }
  hoja = libro.insertSheet(HOJA_CONTENIDO);
  hoja.hideSheet();

  hoja.getRange(1, 1, 1, 3)
      .setValues([['trozo', 'contenido', 'publicadoEn']])
      .setFontWeight('bold');

  var TAM = 45000;
  var filas = [];
  for (var i = 0; i * TAM < cuerpo.length; i++) {
    filas.push([i, cuerpo.substr(i * TAM, TAM), i === 0 ? new Date() : '']);
  }
  hoja.getRange(2, 1, filas.length, 3).setValues(filas);

  return json({ ok: true, trozos: filas.length, bytes: cuerpo.length });
}

function leerContenido() {
  var libro = SpreadsheetApp.openById(HOJA_ID);
  var hoja = libro.getSheetByName(HOJA_CONTENIDO);
  if (!hoja || hoja.getLastRow() < 2) {
    return json({ ok: true, vacio: true });
  }

  var filas = hoja.getRange(2, 1, hoja.getLastRow() - 1, 3).getValues();
  filas.sort(function (a, b) { return a[0] - b[0]; });

  var texto = filas.map(function (f) { return f[1]; }).join('');
  var publicadoEn = filas.length ? filas[0][2] : '';

  try {
    return json({
      ok: true,
      vacio: false,
      publicadoEn: publicadoEn ? new Date(publicadoEn).toISOString() : '',
      contenido: JSON.parse(texto)
    });
  } catch (err) {
    return json({ ok: false, error: 'El contenido guardado no es JSON válido.' });
  }
}

/* ------------------------------------------------------------------ */
/* 3. Entregas de un estudiante                                        */
/* ------------------------------------------------------------------ */

/**
 * Devuelve las filas en las que aparece ese correo, mirando en cualquier
 * columna de correo. Así cada estudiante ve lo suyo, y sólo lo suyo.
 */
function misEntregas(p) {
  var correo = String(p.email || '').trim().toLowerCase();
  if (!correo) return json({ ok: false, error: 'Falta el correo.' });

  var libro = SpreadsheetApp.openById(HOJA_ID);
  var resultado = [];

  libro.getSheets().forEach(function (hoja) {
    var nombre = hoja.getName();
    if (nombre.charAt(0) === '_') return;          // hojas internas
    if (hoja.getLastRow() < 2) return;

    var datos = hoja.getDataRange().getValues();
    var cabeceras = datos[0];

    var columnasCorreo = [];
    cabeceras.forEach(function (c, i) {
      if (/email|correo|cuenta/i.test(String(c))) columnasCorreo.push(i);
    });
    if (!columnasCorreo.length) return;

    for (var f = 1; f < datos.length; f++) {
      var coincide = columnasCorreo.some(function (i) {
        return String(datos[f][i]).trim().toLowerCase() === correo;
      });
      if (!coincide) continue;

      var fila = {};
      cabeceras.forEach(function (c, i) {
        if (c === '') return;
        var v = datos[f][i];
        fila[String(c)] = (v instanceof Date) ? v.toISOString() : String(v);
      });
      resultado.push({ hoja: nombre, fila: f + 1, datos: fila });
    }
  });

  resultado.sort(function (a, b) {
    return String(b.datos.recibidoEn || '').localeCompare(String(a.datos.recibidoEn || ''));
  });

  return json({ ok: true, email: correo, total: resultado.length, entregas: resultado });
}

/* ------------------------------------------------------------------ */

function leerCabeceras(hoja) {
  if (hoja.getLastRow() === 0 || hoja.getLastColumn() === 0) return [];
  return hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0].filter(String);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
