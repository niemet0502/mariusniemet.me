import React from "react";
import { BsInstagram, BsLinkedin } from "react-icons/bs";
import { FaGithubSquare, FaTwitterSquare } from "react-icons/fa";

const LeftSideBar = () => {
  return (
    <div className="left-nav">
      <div className="">
        <a
          href="https://github.com/niemet0502"
          target="_blank"
          rel="noreferrer"
        >
          <FaGithubSquare />
        </a>
        <a
          href="https://www.linkedin.com/in/marius-vincent-niemet-928b48182/"
          target="_blank"
          rel="noreferrer"
        >
          <BsLinkedin />
        </a>
        <a
          href="https://twitter.com/mariusniemet05"
          target="_blank"
          rel="noreferrer"
        >
          <FaTwitterSquare />
        </a>
        <a
          href="https://instagram.com/mariusniemet05"
          target="_blank"
          rel="noreferrer"
        >
          <BsInstagram />
        </a>
      </div>
    </div>
  );
};

export default LeftSideBar;
