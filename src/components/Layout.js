import React from "react";
import { Helmet } from "react-helmet";
import logo from "../../static/logo.png";
import { ThemeProvider } from "../context/ThemeContext";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <ThemeProvider>
      <div>
        <Helmet>
          <link rel="shortcut icon" type="image/png" href={logo} />
        </Helmet>

        <div id="layout" className="layout">
          <Header />
          <main>{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
