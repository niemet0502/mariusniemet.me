import { Link } from "gatsby";
import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useTheme } from "../context/ThemeContext";

const Header = () => {
  const [visible, setVisible] = useState(false);
  const { theme, toggleTheme } = useTheme();

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

          <div className="nav-actions">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            <div className="mobile-navigation-toggle">
              <GiHamburgerMenu onClick={() => setVisible((prev) => !prev)} />
            </div>
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
