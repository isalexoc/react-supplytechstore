import { Helmet } from "react-helmet-async";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Bienvenido a Supply Tech Store",
  description: "Ofrecemos los mejores productos al mejor precio",
  keywords: "ferretería, electronica, comprar electronica, barato",
};

export default Meta;
