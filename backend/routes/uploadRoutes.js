import path from "path";
import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
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

router.post("/", (req, res) => {
  uploadSingleImage(req, res, function (err) {
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

    // Upload image to Cloudinary with transformations
    cloudinary.uploader.upload(
      req.file.path,
      transformations,
      (error, result) => {
        if (error) {
          // Remove image from uploads folder in case of upload error
          fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr)
              console.error("Error deleting temporary file:", unlinkErr);
          });

          return res.status(400).send({ message: error.message });
        } else {
          // Remove image from uploads folder after successful upload
          fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr)
              console.error("Error deleting temporary file:", unlinkErr);
          });

          return res.status(200).send({
            message: "Imagen subida correctamente",
            image: result.secure_url,
          });
        }
      }
    );
  });
});

export default router;
