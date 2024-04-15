import { Helmet } from "react-helmet-async";
import { useState } from "react";

const Meta = ({
  title,
  description,
  keywords,
  contentImage,
  contentDescription,
  contentTitle,
}) => {
  const [image, setImage] = useState(
    "https://www.supplytechstore.com/images/logoog.jpg"
  );
  const [contentDescriptionState, setContentDescriptionState] = useState(
    "Materiales especializados en soldadura, corte, medición, seguridad industrial, y ferreteria."
  );
  const [propertyTitleState, setPropertyTitleState] =
    useState("SupplyTechStore");

  if (contentImage) {
    setImage(contentImage);
  }

  if (contentDescription) {
    setContentDescriptionState(contentDescription);
  }

  if (contentTitle) {
    setPropertyTitleState(contentTitle);
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
      <meta property="og:image" content={image} />
      <meta property="og:description" content={contentDescriptionState} />
      <meta property="og:title" content={propertyTitleState} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Bienvenido a Supply Tech Store",
  description: "Ofrecemos los mejores productos al mejor precio",
  keywords: "ferretería, electronica, comprar electronica, barato",
};

export default Meta;
