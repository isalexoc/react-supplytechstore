import { Helmet } from "react-helmet-async";

const Meta = ({
  title,
  description,
  keywords,
  contentImage,
  contentDescription,
  contentTitle,
  serviceUrl,
  serviceType,
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta property="og:type" content={serviceType} />
      <meta property="og:title" content={contentTitle} />
      <meta name="description" content={description} />
      <meta property="og:image" content={contentImage} />
      <meta property="og:url" content={serviceUrl} />
      <meta name="keyword" content={keywords} />
      <meta property="og:description" content={contentDescription} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Bienvenido a Supply Tech Store",
  description: "Ofrecemos los mejores productos al mejor precio",
  keywords: "ferretería, electronica, comprar electronica, barato",
  contentImage: "https://www.supplytechstore.com/images/logoog.jpg",
  contentDescription:
    "Materiales especializados en soldadura, corte, medición, seguridad industrial, y ferreteria.",
  contentTitle: "SupplyTechStore",
  serviceUrl: "https://www.supplytechstore.com",
  serviceType: "website",
};

export default Meta;
