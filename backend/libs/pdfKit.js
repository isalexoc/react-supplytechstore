import PDFdocument from "pdfkit-table";

function buildPDF(dataCallback, endCallback, order, user, logoPath) {
  const doc = new PDFdocument();

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  const formattedDate = new Intl.DateTimeFormat("es-VE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Caracas", // Adjust the timeZone according to the specific South American country if needed
  }).format(new Date(order.createdAt));

  doc.image(logoPath, 400, 35, {
    fit: [200, 200], // Adjust the size of the logo. [width, height]
    //aling the logo at the end of the page
    align: "right",
    valign: "top", // Align the logo at the top of the page.
  });

  doc.fontSize(25).text("Recibo de pago", { underline: true });
  doc.fontSize(15).text(`ID de la orden: ${order._id}`, { underline: false });
  doc.text(`Nombre: ${user.name}`);
  doc.text(`Email: ${user.email}`);
  doc.text(`Fecha: ${formattedDate}`);

  // leave 2 lines
  doc.moveDown();
  doc.moveDown();
  doc.text(`Datos de la Orden`);
  doc.moveDown();
  doc.moveDown();

  const itemRows = order.orderItems.map((item) => ({
    name: item.name,
    qty: item.qty.toString(),
    price: `$${item.price.toFixed(2)}`,
  }));

  const specialRows = [
    {
      name: "",
      qty: "Subtotal",
      price: `$${order.itemsPrice.toFixed(2)}`,
      options: { backgroundColor: "#b1b1b1", font: "Helvetica-Bold" },
    },
    {
      name: "",
      qty: "Envío",
      price: `$${order.shippingPrice.toFixed(2)}`,
      options: { backgroundColor: "#949494", font: "Helvetica-Bold" },
    },
    {
      name: "",
      qty: "Total",
      price: `$${order.totalPrice.toFixed(2)}`,
      options: { backgroundColor: "#6b6b6b", font: "Helvetica-Bold" },
    },
  ];

  const tableData = [...itemRows, ...specialRows];

  doc.table(
    {
      headers: [
        { label: "Producto", property: "name", align: "left" },
        { label: "Cant", property: "qty", align: "right" },
        { label: "Precio", property: "price", align: "right" },
      ],
      datas: tableData,
    },
    {
      width: 500,
      prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
        if (row.options) {
          doc.font(row.options.font).fillColor(row.options.backgroundColor);
        } else {
          doc.font("Helvetica");
        }
      },
    }
  );

  doc.moveDown(2);
  doc.text("Gracias por su compra", { align: "center" });

  doc.end();
}

export default buildPDF;
