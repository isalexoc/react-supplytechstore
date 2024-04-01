import React from "react";
import { Link } from "react-router-dom";

const Brands = () => {
  const logos = [
    "/images/l1.jpg",
    "/images/l2.jpg",
    "/images/l3.jpg",
    "/images/l4.jpg",
    "/images/l5.jpg",
    "/images/l6.jpg",
    "/images/l7.jpg",
    "/images/l8.jpg",
  ];

  // Example array of links that correspond to each logo
  const links = [
    "3m",
    "3w",
    "weldtech",
    "covo",
    "bosch",
    "lincoln",
    "hoffman",
    "flammer",
  ];

  return (
    <div className="brands-grid">
      {logos.map((logo, index) => (
        <Link key={index} to={`/search/${links[index]}`}>
          <img src={logo} alt={`Brand ${index + 1}`} className="brand-logo" />
        </Link>
      ))}
    </div>
  );
};

export default Brands;
