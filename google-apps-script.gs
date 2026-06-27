var SHEET_NAME = "Waitlist";

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Data", "Prenume", "Email", "Capitol", "Sursă"]);
    }

    var p = (e && e.parameter) || {};
    sheet.appendRow([
      new Date(),
      p.prenume || "",
      p.email || "",
      p.capitol || "",
      "landing",
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
