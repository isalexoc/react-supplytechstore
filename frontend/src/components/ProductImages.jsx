import { Image } from "react-bootstrap";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const ProductImages = ({ product }) => {
  const items = product?.images?.map((image) => ({
    original: image.url,
    thumbnail: image.url,
  }));

  // Check if there is a video and add it to the gallery items
  if (product?.video?.url) {
    items.push({
      renderItem: () => (
        <div
          className="image-gallery-image"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <video
            controls
            preload="metadata"
            style={{
              maxWidth: "100%", // Ensures the video does not exceed the container's width
              maxHeight: "100%", // Ensures the video does not exceed the container's height
              objectFit: "contain", // Ensures the video maintains its aspect ratio and fits within its bounds
            }}
          >
            <source src={product.video.url} type="video/mp4" />
            Tu navegador no soporta video HTML5.
          </video>
        </div>
      ),
      thumbnail: "/images/mpthumb.png", // Optional: path to a thumbnail for the video
    });
  }

  return (
    <>
      {product?.images && product?.images?.length > 0 && (
        <ImageGallery
          items={items}
          showPlayButton={false}
          showFullscreenButton={false}
          showNav={false}
          showBullets
          autoPlay={false}
        />
      )}
      {product?.image && product?.images?.length === 0 && (
        <Image src={product.image} alt={product.name} fluid />
      )}
    </>
  );
};

export default ProductImages;
