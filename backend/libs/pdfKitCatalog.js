import PDFdocument from "pdfkit-table";

function buildPDF(dataCallback, endCallback, product, user, logoPath) {
  const doc = new PDFdocument();

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  const formattedDate = new Intl.DateTimeFormat("es-VE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Caracas", // Adjust the timeZone according to the specific South American country if needed
  }).format(new Date());

  doc.image(logoPath, 400, 35, {
    fit: [200, 200], // Adjust the size of the logo. [width, height]
    //aling the logo at the end of the page
    align: "right",
    valign: "top", // Align the logo at the top of the page.
  });

  doc.text(`Nombre: ${user.name}`);
  doc.text(`Email: ${user.email}`);
  doc.text(`Fecha: ${formattedDate}`);

  doc.moveDown(2);
  doc.text("Gracias por descargar el catálogo", { align: "center" });

  doc.end();
}

export default buildPDF;
