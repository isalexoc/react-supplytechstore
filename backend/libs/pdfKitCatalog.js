import PDFDocument from "pdfkit-table"; // Ensure PDFDocument is correctly imported
import fetch from "node-fetch";
import getDollarPrice from "../utils/getDollarPrice.js";

// Assuming getDollarPrice is async and needs to be awaited when used
const dollarPrice = await getDollarPrice();

function fetchWithTimeout(url, timeout) {
  return Promise.race([
    fetch(url), // The fetch request
    new Promise(
      (_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), timeout) // Timeout promise
    ),
  ]);
}

async function fetchImageWithTimeout(url, timeoutMs) {
  try {
    const response = await fetchWithTimeout(url, timeoutMs);
    if (!response.ok)
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    return await response.buffer();
  } catch (error) {
    console.error("Error fetching image:", error);
    return null; // Handle the error by returning null
  }
}

async function buildPDF(dataCallback, endCallback, products, logoPath) {
  const productsToPrint = products;
  const doc = new PDFDocument({
    margins: { top: 50, left: 50, right: 50, bottom: 50 },
  });

  doc.on("data", dataCallback);
  doc.on("end", endCallback);

  const formattedDate = new Intl.DateTimeFormat("es-VE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Caracas",
  }).format(new Date());

  // Header Information
  doc.image(logoPath, 50, 50, { fit: [50, 50] });
  doc
    .fontSize(12)
    .text(`Catálogo de productos de SUPPLYTECHSTORE.COM`, 120, 50, {
      align: "center",
    });
  doc.moveDown(2);
  doc.text(`Fecha: ${formattedDate}`, { align: "center" });

  doc.moveDown(2);

  doc.text(`Cantidad de productos ${productsToPrint.length}`, {
    align: "center",
  });

  doc.moveDown(2);

  let productCount = 0;
  let productsPerPage = 6; // First page has 6 products

  for (let product of productsToPrint) {
    if (product) {
      if (productCount === productsPerPage) {
        doc.addPage();
        productsPerPage = 7; // Subsequent pages have 7 products
        productCount = 0;
      }

      let initialY = doc.y;
      let imageBuffer = null;
      let imageUrl =
        product.images && product.images.length > 0
          ? product.images[0].url
          : product.image;

      if (imageUrl) {
        imageBuffer = await fetchImageWithTimeout(imageUrl, 5000);
        if (imageBuffer) {
          doc.image(imageBuffer, {
            fit: [100, 100],
            align: "left",
            valign: "top",
            x: 50,
            y: initialY,
          });
        } else {
          doc.text("Failed to load image for " + product.name, 50, initialY);
        }
      } else {
        doc.text("No image available for " + product.name, 50, initialY);
      }

      // Text beside the image
      const textStartX = 160;
      doc.fontSize(10).text(`ID: ${product._id}`, textStartX, initialY);
      doc.text(`Nombre: ${product.name}`, textStartX, doc.y);
      doc.text(`Marca: ${product.brand}`, textStartX, doc.y);
      doc.text(
        `Precio Dólares: ${product.price.toFixed(2)}`,
        textStartX,
        doc.y
      );
      doc.text(
        `Precio Bolívares: ${(product.price * dollarPrice).toFixed(2)}`,
        textStartX,
        doc.y
      );

      productCount++;
      doc.moveDown(3);
    } else {
      doc.text("Product is missing name", 50, doc.y);
    }
  }

  doc.end();
}

export default buildPDF;
