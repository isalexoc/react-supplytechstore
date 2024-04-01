import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  // Define your WhatsApp link
  const whatsappLink =
    "https://wa.me/584122763933?text=Hola%20quiero%20mas%20info%20sobre%20los%20productos";

  return (
    <a
      href={whatsappLink}
      className="whatsapp-button"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FaWhatsapp size={30} /> {/* You can adjust the size as needed */}
    </a>
  );
};

export default WhatsAppButton;
