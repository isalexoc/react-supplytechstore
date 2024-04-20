import PDFdocument from "pdfkit";

function buildPDF(dataCallback, endCallback) {
  const doc = new PDFdocument();

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  doc.fontSize(20).text("Hello World");

  doc.end();
}

export default buildPDF;
