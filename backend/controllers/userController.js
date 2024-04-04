import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import Subscriber from "../models/subscriberModel.js";
import generateToken from "../utils/generateToken.js";
import nodemailer from "nodemailer";

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Contrasena o email incorrecto");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("Usuario ya existe");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Datos de usuario invalidos");
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Sesión cerrada" });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    generateToken(res, updatedUser._id);

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("No puedes eliminar un usuario administrador");
    }
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: "Usuario eliminado" });
  } else {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }
});

// @desc    Save newsletter subscriber
// @route   POST /api/forms/newsletternew
// @access  Public
const saveSubscriber = asyncHandler(async (req, res) => {
  const { email, userName } = req.body;
  const userExists = await User.findOne({ email });

  if (!email) {
    res.status(400);
    throw new Error("Por favor, introduce tu dirección de correo electrónico");
  }

  // Check if subscriber already exists
  const existingSubscriber = await Subscriber.findOne({ email });
  if (existingSubscriber) {
    res.status(400);
    throw new Error("Ya estás suscrito a nuestro boletín informativo");
  }

  // send email

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "isaac87usa@gmail.com",
      pass: "icdq iclp rccg onhn",
    },
  });

  var mailOptions = {
    from: "supplytech.soldaduras@gmail.com",
    to: email,
    subject: "Subscripción a nuestro boletín informativo",
    text: "Gracias por suscribirse a nuestro boletín informativo. Le mantendremos informado de todas las novedades de supplytechstore.com.",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent to subscriber: " + info.response);
    }
  });

  // save subscriber to the database
  const subscriber = new Subscriber({
    email,
    userName,
  });

  try {
    await subscriber.save();

    if (userExists) {
      //add a true value to the newsletter field
      userExists.newsletter = true;
      await userExists.save();
    }

    res.status(200).json({
      email,
      message:
        "Gracias por suscribirte a nuestro boletín informativo. Te mantendremos informado de todas las novedades de supplytechstore.com.",
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Error al guardar el suscriptor en la base de datos. Por favor, inténtelo de nuevo.",
    });
  }
});

// @desc    Check if user is subscribed to newsletter
// @route   GET /api/forms/newslettercheck
// @access  Private
const checkSubscriber = asyncHandler(async (req, res) => {
  const email = req.query.email; // Use query parameter instead of body

  if (!email) {
    res.status(400);
    throw new Error("Email is required.");
  }

  const existingSubscriber = await Subscriber.findOne({ email });
  if (existingSubscriber) {
    res.json({
      message: "Yes",
      isSubscribed: true,
    });
  } else {
    res.json({
      message: "No",
      isSubscribed: false,
    });
  }
});

// @desc    Unsubscribe user from newsletter
// @route   DELETE /api/forms/newsletterdelete
// @access  Public
const unsubscribeNewsletter = asyncHandler(async (req, res) => {
  const email = req.query.email;

  if (!email) {
    res.status(400);
    throw new Error("El email es requerido.");
  }

  const subscriber = await Subscriber.findOne({ email });

  if (subscriber) {
    await subscriber.deleteOne({ email });
    res.json({
      message: "El usuario ha sido removido de la lista de subscriptores",
    });
  } else {
    res.status(404);
    throw new Error("Subscriber not found.");
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  saveSubscriber,
  checkSubscriber,
  unsubscribeNewsletter,
};
