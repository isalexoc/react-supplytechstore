import { useState } from "react";
import { toast } from "react-toastify";
import { Form } from "react-bootstrap";
import Loader from "./Loader";
import { UPLOAD_URL } from "../constants";

const VideoUpload = ({ setVideoUrl, productVideo }) => {
  const [uploading, setUploading] = useState(false);

  const uploadVideoHandler = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    setUploading(true);
    try {
      const response = await fetch(`${UPLOAD_URL}/video`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setVideoUrl(data.url); // Assuming backend sends back the URL
        toast.success("Video uploaded successfully!");
      } else {
        throw new Error(data.message || "Failed to upload video");
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form.Group controlId="videoUpload">
      <Form.Label>Subir Video</Form.Label>
      <Form.Control
        type="file"
        label="Ingresa un video"
        accept="video/*"
        onChange={uploadVideoHandler}
        disabled={uploading}
      />
      {uploading && <Loader />}
      {productVideo !== "" && (
        <video
          src={productVideo}
          controls
          style={{ width: "100%", marginTop: "10px" }}
        />
      )}
    </Form.Group>
  );
};

export default VideoUpload;
