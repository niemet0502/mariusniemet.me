import React from "react";
import { BsInstagram, BsLinkedin, BsSpotify } from "react-icons/bs";
import { FaGithubSquare, FaTwitterSquare } from "react-icons/fa";

const LeftSideBar = () => {
  return (
    <div className="left-nav">
      <div className="">
        <FaGithubSquare />
        <BsLinkedin />
        <FaTwitterSquare />
        <BsInstagram />
        <BsSpotify />
      </div>
    </div>
  );
};

export default LeftSideBar;
