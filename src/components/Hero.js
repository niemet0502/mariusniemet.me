import React from "react";

const Hero = ({ title, content }) => {
  return (
    <div className="hero">
      <h1>{title}</h1>
      <p>{content}</p>
    </div>
  );
};

export default Hero;
