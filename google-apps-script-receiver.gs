// ============================================================
// GOOGLE APPS SCRIPT - QFDOS Practicas Form Receiver
// ============================================================
// Deploy this script as a Web App in Google Apps Script:
//
// 1. Go to: https://script.google.com/
// 2. Create a new project
// 3. Paste this code
// 4. Click Deploy > New deployment > Web app
//    - Execute as: Your Google account
//    - Who has access: Anyone
// 5. Copy the deployment URL
// 6. Replace the PLACEHOLDER in your React code with the actual deployment ID
//    (the part between /s/ and /exec in the URL)
//
// Target Spreadsheet ID: 1RrMzWJPFOKKH76vJh70pQw9vbiQZNOGOJH7vNaTGkso
// ============================================================

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    var params = e.parameter;
    var sheetId = params.sheetId || '1RrMzWJPFOKKH76vJh70pQw9vbiQZNOGOJH7vNaTGkso';
    var sheetName = params.sheetName;
    
    if (!sheetName) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'sheetName is required'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var ss = SpreadsheetApp.openById(sheetId);
    var sheet = ss.getSheetByName(sheetName);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      // Add headers based on sheet type
      if (sheetName === 'normas de seguridad') {
        sheet.appendRow(['Timestamp', 'Nombre', 'Email', 'Iniciales', 'Fecha', 'Hora', 'Normas Aceptadas']);
        sheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#1a2332').setFontColor('#ffffff');
      } else if (sheetName === 'Material') {
        sheet.appendRow(['Timestamp', 'Nombre', 'Email', 'Puesto', 'Material Faltante', 'Fecha', 'Hora', 'Total Faltante']);
        sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#1a2332').setFontColor('#ffffff');
      }
    }
    
    var timestamp = new Date().toISOString();
    
    if (sheetName === 'normas de seguridad') {
      sheet.appendRow([
        timestamp,
        params.nombre || '',
        params.email || '',
        params.iniciales || '',
        params.fecha || '',
        params.hora || '',
        params.normasAceptadas || ''
      ]);
    } else if (sheetName === 'Material') {
      sheet.appendRow([
        timestamp,
        params.nombre || '',
        params.email || '',
        params.puesto || '',
        params.materialFaltante || '',
        params.fecha || '',
        params.hora || '',
        params.totalFaltante || ''
      ]);
    } else {
      // Generic: just dump all params
      var keys = Object.keys(params).filter(function(k) { return k !== 'sheetId' && k !== 'sheetName'; });
      var row = [timestamp];
      keys.forEach(function(k) { row.push(params[k]); });
      sheet.appendRow(row);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      sheet: sheetName,
      timestamp: timestamp
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
