import { Image } from "react-bootstrap";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const ProductImages = ({ product }) => {
  const images = product?.images?.map((image) => ({
    original: image,
    thumbnail: image,
  }));

  return (
    <>
      {product?.images && product?.images?.length > 0 && (
        <ImageGallery
          items={images}
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
