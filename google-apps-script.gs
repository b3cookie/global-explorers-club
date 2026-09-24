var SHEET_NAME = "Waitlist";
var HEADERS = ["Data", "Prenume", "Email", "Capitol", "Sursă", "Acord", "Text acord"];

/**
 * Se asigură că tabelul are toate coloanele din HEADERS.
 * Pe o foaie goală scrie capul de tabel; pe una care are deja înscrieri
 * (cu vechiul cap de 5 coloane) completează doar coloanele lipsă, fără
 * să atingă datele existente.
 */
function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    return;
  }
  var width = sheet.getLastColumn();
  var current = sheet.getRange(1, 1, 1, width).getValues()[0];
  if (width >= HEADERS.length) return;
  for (var i = width; i < HEADERS.length; i++) {
    sheet.getRange(1, i + 1).setValue(HEADERS[i]);
  }
}

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    ensureHeaders(sheet);

    var p = (e && e.parameter) || {};

    // Fără acord bifat nu înregistrăm nimic: temeiul legal al prelucrării
    // este consimțământul, iar formularul îl cere înainte de trimitere.
    if (p.acord !== "da") {
      return ContentService
        .createTextOutput(JSON.stringify({ ok: false, error: "missing consent" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    sheet.appendRow([
      new Date(),
      p.prenume || "",
      p.email || "",
      p.capitol || "",
      "landing",
      "da",
      p.acord_text || "",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput("Global Explorers Club — waitlist endpoint active.");
}
