import { Form } from "react-bootstrap";

const VideoUpload = ({
  productVideo,
  videoUploaded,
  setVideoUploaded,
  uploading,
}) => {
  const handleUploadChange = (e) => {
    if (!e.target.files.length) return;
    setVideoUploaded(e.target.files[0]);
  };

  return (
    <Form.Group controlId="videoUpload">
      <Form.Label>Subir Video</Form.Label>
      <Form.Control
        type="file"
        label="Ingresa un video"
        accept="video/*"
        onChange={handleUploadChange}
        disabled={uploading}
      />
      {productVideo?.url !== "" && !videoUploaded && (
        <video
          src={productVideo?.url}
          controls
          style={{ width: "100%", marginTop: "10px" }}
        />
      )}
    </Form.Group>
  );
};

export default VideoUpload;
