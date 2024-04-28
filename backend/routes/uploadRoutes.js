import path from "path";
import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises"; // Import fs promises for async operations

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Solo puedes subir imágenes .jpg, .jpeg o .png"), false);
  }
}

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");
const uploadImages = multer({ storage, fileFilter }).array("image", 6); // This handles up to 6 files

router.post("/multiple", uploadImages, async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send({ message: "No se han cargado fotos" });
  }

  try {
    const uploadPromises = req.files.map((file) => {
      const transformations = {
        width: 640,
        height: 510,
        crop: "fill",
        quality: "auto:good",
        fetch_format: "auto",
      };
      return cloudinary.uploader.upload(file.path, transformations);
    });

    const results = await Promise.all(uploadPromises);

    // Once all files are uploaded, delete them from the local storage
    const unlinkPromises = req.files.map((file) => fs.unlink(file.path));
    await Promise.all(unlinkPromises);

    return res.status(200).send({
      message: "Imagenes subidas correctamente",
      images: results.map((result) => result.secure_url),
    });
  } catch (error) {
    // Attempt to delete all local files even if the upload fails
    req.files.forEach((file) => {
      fs.unlink(file.path).catch(console.error);
    });
    console.error(error);
    return res.status(400).send({ message: error.message });
  }
});

router.post("/", (req, res) => {
  uploadSingleImage(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    // Specify transformations: crop to 500x500 and auto adjust quality for web use
    const transformations = {
      width: 640,
      height: 510,
      crop: "fill", // Crop the image to fit the specified dimensions
      quality: "auto:good", // Automatically adjust quality for smaller size with good visual results
      fetch_format: "auto", // Automatically select the best file format depending on the client
    };

    try {
      // Upload image to Cloudinary with transformations
      const result = await cloudinary.uploader.upload(
        req.file.path,
        transformations
      );

      // Remove image from uploads folder after successful upload
      await fs.unlink(req.file.path);

      return res.status(200).send({
        message: "Imagen subida correctamente",
        image: result.secure_url,
      });
    } catch (error) {
      // Attempt to delete the temporary file even if the upload fails
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkErr) {
        console.error("Error deleting temporary file:", unlinkErr);
      }

      return res.status(400).send({ message: error.message });
    }
  });
});

router.post("/uploadzelle", (req, res) => {
  uploadSingleImage(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    // Specify transformations: crop to 500x500 and auto adjust quality for web use
    const transformations = {
      quality: "auto:good", // Automatically adjust quality for smaller size with good visual results
      fetch_format: "auto", // Automatically select the best file format depending on the client
    };

    try {
      // Upload image to Cloudinary with transformations
      const result = await cloudinary.uploader.upload(
        req.file.path,
        transformations
      );

      // Remove image from uploads folder after successful upload
      await fs.unlink(req.file.path);

      return res.status(200).send({
        message: "Imagen subida correctamente",
        image: result.secure_url,
      });
    } catch (error) {
      // Attempt to delete the temporary file even if the upload fails
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkErr) {
        console.error("Error deleting temporary file:", unlinkErr);
      }

      return res.status(400).send({ message: error.message });
    }
  });
});

export default router;
