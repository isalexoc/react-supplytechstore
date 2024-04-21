import PDFdocument from "pdfkit";

function buildPDF(dataCallback, endCallback, order, user) {
  const doc = new PDFdocument();

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  doc.fontSize(25).text("Factura", { underline: true });
  doc.fontSize(15).text(`Order ID: ${order._id}`, { underline: false });
  doc.text(`Nombre: ${user.name}`);
  doc.text(`Total: $${order.totalPrice}`);

  doc.end();
}

export default buildPDF;
