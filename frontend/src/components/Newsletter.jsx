import React, { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically integrate with your backend or a third-party service to handle the email subscription.
    console.log("Subscribing email:", email);
    // Clear the input after submission for feedback (or you could display a success message)
    setEmail("");
    alert("Thanks for subscribing!");
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="d-flex flex-column align-items-start"
      >
        <h5 className="text-primary mb-3 mt-3 mt-md-0">
          <strong className="text-primary">
            Regístrate en nuestros boletines
          </strong>
        </h5>
        <div className="d-flex">
          <input
            type="email"
            className="form-control"
            placeholder="Tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary ms-2">
            Subscribirse
          </button>
        </div>
      </form>
    </div>
  );
};

export default Newsletter;
