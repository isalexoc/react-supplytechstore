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

const storageInBuffer = multer.memoryStorage();

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

//delete image fro cloudinary using the public id
const deleteImage = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error(error);
  }
};

const uploadVideo = multer({
  storageInBuffer,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for videos
}).single("video");

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");
const uploadImages = multer({ storage, fileFilter }).array("image", 6); // This handles up to 6 files
const uploadMultiple = multer({ storageInBuffer, fileFilter }).array(
  "image",
  6
);

router.post("/uploadmultiple", uploadMultiple, async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send({ message: "No se han cargado fotos" });
  }
  try {
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const transformations = {
          resource_type: "image",
          transformation: [
            {
              width: 640,
              height: 510,
              crop: "fill",
              quality: "auto:good",
              fetch_format: "auto",
            },
          ],
        };

        cloudinary.uploader
          .upload_stream(transformations, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);
    res.status(200).send({
      message: "Imagenes subidas correctamente",
      images: results.map((result) => result.secure_url),
      imageData: results.map((result) => ({
        url: result.secure_url,
        public_id: result.public_id,
      })),
    });
  } catch (error) {
    console.error("Upload error:", error);
    res
      .status(500)
      .send({ message: "Failed to upload images", error: error.message });
  }
});

router.post("/multiple", uploadImages, async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send({ message: "No se han cargado fotos" });
  }

  try {
    const uploadPromises = await req.files.map((file) => {
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
      imageData: results.map((result) => ({
        url: result.secure_url,
        public_id: result.public_id,
      })),
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

// remove images from cloudinary using the public ids
router.post("/removeImages", async (req, res) => {
  const { imagesData } = req.body;
  if (!imagesData || imagesData.length === 0) {
    return res.status(400).send({ message: "No se han seleccionado imágenes" });
  }

  try {
    const deletePromises = imagesData.map((imageData) =>
      deleteImage(imageData.public_id)
    );
    await Promise.all(deletePromises);

    return res
      .status(200)
      .send({ message: "Imagenes eliminadas correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ message: error.message });
  }
});

// remove single image from cloudinary using the public id
router.post("/removeSingleImage", async (req, res) => {
  const { imageData } = req.body;
  if (!imageData) {
    return res
      .status(400)
      .send({ message: "No se ha seleccionado una imagen" });
  }

  try {
    imageData.forEach((image) => deleteImage(image.public_id));

    return res.status(200).send({ message: "Imagen eliminada correctamente" });
  } catch (error) {
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
        imageData: [{ url: result.secure_url, public_id: result.public_id }],
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

router.post("/video", uploadVideo, async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No se ha cargado un video" });
  }

  try {
    // Convert buffer to readable stream for Cloudinary
    const uploadStream = cloudinary.uploader
      .upload_stream(
        {
          resource_type: "video",
          chunk_size: 6000000, // 6MB chunks
          transformation: [
            {
              width: 640,
              height: 510,
              crop: "limit",
              bitrate: "500k",
              quality: "auto",
            }, // Adjust transformations as needed
          ],
        },
        (error, result) => {
          if (error) {
            return res.status(400).send({ message: error.message });
          }
          return res.status(200).send({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      )
      .end(req.file.buffer);
  } catch (error) {
    console.error("Upload error:", error);
    return res
      .status(500)
      .send({ message: "Failed to upload video", error: error.message });
  }
});

export default router;
