import { Link } from "gatsby";
import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

const Header = () => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="header-container">
      <div className="top-nav">
        <div className="top-nav-wrapper">
          <div className="logo-container">
            <Link to="/">
              <img src="/logo.png" className="logo" alt="logo" />
            </Link>
          </div>

          <div className="navigation">
            <ul>
              <li>
                <Link to="/about">
                  <span className="page-number">01.</span>
                  <span className="link">About</span>
                </Link>
              </li>
              <li>
                <Link to="/articles">
                  <span className="page-number">02.</span>
                  <span className="link">Articles</span>
                </Link>
              </li>
              <li>
                <Link to="/notes">
                  <span className="page-number">03.</span>
                  <span className="link">Notes</span>
                </Link>
              </li>
              <li>
                <Link to="/reads">
                  <span className="page-number">04.</span>
                  <span className="link">Read Log</span>
                </Link>
              </li>
              <li>
                <Link to="/projects">
                  <span className="page-number">05.</span>
                  <span className="link">Projects</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="mobile-navigation-toggle">
            <GiHamburgerMenu onClick={() => setVisible((prev) => !prev)} />
          </div>
        </div>
      </div>
      {visible && (
        <div className="mobile-navigation">
          <ul>
            <li>
              <Link to="/about">
                <span className="page-number">01.</span>
                <span className="link">About</span>
              </Link>
            </li>
            <li>
              <Link to="/articles">
                <span className="page-number">02.</span>
                <span className="link">Articles</span>
              </Link>
            </li>
            <li>
              <Link to="/notes">
                <span className="page-number">03.</span>
                <span className="link">Notes</span>
              </Link>
            </li>
            <li>
              <Link to="/reads">
                <span className="page-number">04.</span>
                <span className="link">Read Log</span>
              </Link>
            </li>
            <li>
              <Link to="/projects">
                <span className="page-number">05.</span>
                <span className="link">Projects</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
