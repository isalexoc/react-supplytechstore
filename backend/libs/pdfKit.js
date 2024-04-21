import PDFdocument from "pdfkit";

function buildPDF(dataCallback, endCallback, order, user) {
  const doc = new PDFdocument();

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  doc.fontSize(25).text("Factura", { underline: true });
  doc.fontSize(15).text(`ID de la orden: ${order._id}`, { underline: false });
  doc.text(`Nombre: ${user.name}`);
  // leave 2 lines
  doc.moveDown();
  doc.moveDown();
  doc.text(`Datos de la Orden`);

  doc.end();
}

export default buildPDF;
