import React from "react";
import "./src/styles/style.css";
require("prismjs/themes/prism-solarizedlight.css");

// Inject a script to set the theme BEFORE React hydrates to prevent flash
export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <script
      key="theme-init"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var saved = localStorage.getItem('theme');
              var theme = (saved === 'light' || saved === 'dark') ? saved : 'dark';
              document.documentElement.setAttribute('data-theme', theme);
            } catch(e) {}
          })();
        `,
      }}
    />,
  ]);
};
