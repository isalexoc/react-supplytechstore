import path from "path";
import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises"; // Import fs promises for async operations

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
  uploadSingleImage(req, res, async (err) => {
    // Log req.file and req.body
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);
    console.log("err:", err);
    console.log("req.file.path:", req.file.path);
    console.log("req.file.originalname:", req.file.originalname);
    console.log("req.file.size:", req.file.size);
    console.log("req.file.mimetype:", req.file.mimetype);
    console.log("req.file.filename:", req.file.filename);
    console.log("req.file.fieldname:", req.file.fieldname);

    // Check if req.file is defined
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }
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

export default router;
