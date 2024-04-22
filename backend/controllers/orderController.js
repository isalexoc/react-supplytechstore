import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import { calcPrices } from "../utils/calcPrices.js";
import { verifyPayPalPayment, checkIfNewTransaction } from "../utils/paypal.js";
import sendEmailHandler from "../utils/sendEmailHandler.js";
import {
  paymentConfirmationEmail,
  defaultEmail,
} from "../utils/sendEmailHandler.js";
import buildPDF from "../libs/pdfKit.js";
import { uploadFile } from "../utils/uploadToGoogle.js";
import path from "path";

const adminEmail = process.env.ADMIN_EMAIL;

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, shippingMethod } =
    req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    // get the ordered items from our database
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });

    // map over the order items and use the price from our items from database
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    if (shippingMethod === "pickup") {
      shippingAddress.address =
        "Retiro en tienda, Av. Bolivar Oeste #150 C/C Av. Ayacucho, Edificio Don Antonio, Piso B, Local 2";
      shippingAddress.estado = "Aragua";
      shippingAddress.city = "Maracay";
      shippingAddress.postalCode = "2101";
      shippingAddress.country = "Venezuela";
    }

    // calculate prices
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(
      dbOrderItems,
      shippingAddress.city,
      shippingMethod
    );

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice: shippingMethod === "pickup" ? 0 : shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    //send email to user and admin

    const emailDataUser = {
      to: req.user.email,
      name: req.user.name,
      admin: false,
      subject: "Orden de compra",
      text: `Hola ${req.user.name}. /n
         Gracias por tu orden de compra en nuestra tienda. Tu orden ha sido recibida y será procesada en breve. /n 
         Recuerda que puedes ver el estado de tu orden en tu perfil: https://www.supplytechstore.com/profile /n
         También puedes contactarnos si tienes alguna pregunta.`,
    };
    await sendEmailHandler(emailDataUser);

    const emailDataAdmin = {
      to: adminEmail,
      admin: true,
      subject: "Tienes una nueva orden",
      clientUser: req.user.name,
      clientEmail: req.user.email,
      clientOrder: createdOrder._id,
      clientId: req.user._id,
    };
    await sendEmailHandler(emailDataAdmin);

    res.status(201).json(createdOrder);
  }
});

// @des   Get logged in user orders
// @route GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

// @des   Get order by ID
// @route GET /api/orders/:id
// @access Private/Admin
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Orden no encontrada.");
  }
});

// @des   Update order to paid
// @route PUT /api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const { verified, value } = await verifyPayPalPayment(req.body.id);
  if (!verified) throw new Error("Payment not verified");

  // check if this transaction has been used before
  const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
  if (!isNewTransaction) throw new Error("Transaction has been used before");

  const order = await Order.findById(req.params.id);

  if (order) {
    // check the correct amount was paid
    //console.log order.totalPrice.toString() but use always 2 decimals
    const paidCorrectAmount = order.totalPrice.toFixed(2) === value;
    if (!paidCorrectAmount) throw new Error("Incorrect amount paid");

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @des   Update order to delivered
// @route PUT /api/orders/:id/deliver
// @access Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Orden no encontrada.");
  }
});

// @des   Get all orders
// @route GET /api/orders
// @access Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT || 12;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Order.countDocuments();
  const orders = await Order.find({})
    .sort("-createdAt")
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .populate("user", "id name");
  res.status(200).json({ orders, page, pages: Math.ceil(count / pageSize) });
});

// @des   Update payment method
// @route PUT /api/orders/changePay
// @access Private
const updatePaymentMethod = asyncHandler(async (req, res) => {
  const { orderId, paymentMethod } = req.body;

  const order = await Order.findById(orderId);

  if (order) {
    order.paymentMethod = paymentMethod;

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @des   Update order zelle
// @route PUT /api/orders/updateOrderZelle
// @access Private
const updateOrderZelle = asyncHandler(async (req, res) => {
  const { orderId, referenceType, code, image } = req.body;

  console.log(orderId);
  const order = await Order.findById(orderId);
  const user = await User.findById(order.user);

  if (order) {
    if (referenceType === "delete") {
      order.paymentConfirmation = {
        referenceType: "",
        code: "",
        image: "",
      };
    }
    if (referenceType === "ReferenceNumber") {
      order.paymentConfirmation = {
        referenceType,
        code,
      };
    }

    if (referenceType === "ReferenceImage") {
      order.paymentConfirmation = {
        referenceType,
        image,
      };
    }

    if (referenceType === "both") {
      order.paymentConfirmation = {
        referenceType,
        code,
        image,
      };
    }
    console.log(referenceType);
    console.log(order.paymentConfirmation);

    try {
      const updatedOrder = await order.save();
      res.json(updatedOrder);

      //send email to user and admin
      if (referenceType !== "delete") {
        const emailDataUser = {
          to: user.email,
          userEmail: user.email,
          name: user.name,
          admin: false,
          type: "ZELLE",
          code,
          image,
          orderId: updatedOrder._id,
          subject: "Confirmación de pago",
        };
        await paymentConfirmationEmail(emailDataUser);
        emailDataUser.admin = true;
        emailDataUser.to = adminEmail;
        await paymentConfirmationEmail(emailDataUser);
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @des   Mark as paid
// @route PUT /api/orders/:id/markAsPaid
// @access Private/Admin
const markAsPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  const user = await User.findById(order.user);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: order._id,
      status: "COMPLETED BY ADMIN - MARKED AS PAID",
      update_time: Date.now().toString(),
      email_address: user.email,
    };

    const updatedOrder = await order.save();

    //upload file to google cloud
    /*  
    const filePath = "./backend/data/pueba.pdf";

    async function main() {
      try {
        const publicUrl = await uploadFile(filePath);
        console.log(`Successfully uploaded file to: ${publicUrl}`);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    main(); */

    //send email to user and admin
    const emailDataUser = {
      to: user.email,
      name: user.name,
      type: "Pago",
      orderId: updatedOrder._id,
      subject: `Pago confirmado de la orden ${updatedOrder._id}`,
      message: `Tu orden ha sido marcada como pagada por el administrador. Gracias por tu compra. Puedes ver el estado de tu orden en tu perfil: https://www.supplytechstore.com/profile
      si tienes alguna pregunta, no dudes en contactarnos.
      
      Datos de la orden:
      Orden: ${updatedOrder._id}
      Total: ${updatedOrder.totalPrice}
      Método de pago: Marcado como pagado por el administrador`,
    };
    await defaultEmail(emailDataUser);

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @des   Get invoice
// @route GET /api/orders/getInvoice/:id
// @access Private
const getInvoice = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  const user = await User.findById(order.user);

  if (order) {
    try {
      const __dirname = path.resolve();
      const logoPath = path.join(
        __dirname,
        "frontend/public/images/logo192.png"
      );

      const stream = res.writeHead(200, {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${req.params.id}.pdf`,
      });

      buildPDF(
        (data) => {
          stream.write(data);
        },
        () => {
          stream.end();
        },
        order,
        user,
        logoPath
      );
    } catch (error) {
      console.log(error);
      throw new Error("Error al generar la factura");
    }
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
  updatePaymentMethod,
  updateOrderZelle,
  markAsPaid,
  getInvoice,
};
