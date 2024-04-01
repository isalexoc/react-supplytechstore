import YoutubeEmbed from "./YoutubeEmbed";
import { LinkContainer } from "react-router-bootstrap";

const BannerVideo = () => (
  <div className="bannerVideoParent mb-5">
    <YoutubeEmbed embedId="Px3dx81SRgE" />
    <div className="video-overlay"></div>
    <div className="hero-text">
      <h1>Tu Proyecto, Nuestras Herramientas</h1>
      <p className="fs-4">
        Especialistas en soldadura, taladros, maquinaria para soldar y
        ferretería en general.
      </p>
      {/* Action Button */}
      <LinkContainer to="/products">
        <button className="btn btn-outline-light mt-4">Ver Catálogo</button>
      </LinkContainer>
    </div>
  </div>
);

export default BannerVideo;