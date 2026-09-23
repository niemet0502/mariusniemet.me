import React from "react";
import "./src/styles/style.css";
require("prismjs/themes/prism-solarizedlight.css");

const { MAINTENANCE_MODE, ALLOWED_PATHS } = require("./src/utils/maintenance");

// Inject a script to set the theme BEFORE React hydrates to prevent flash
export const onRenderBody = ({ setHeadComponents }) => {
  const headComponents = [
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
  ];

  if (MAINTENANCE_MODE) {
    headComponents.unshift(
      <script
        key="maintenance-redirect"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var allowed = ${JSON.stringify(ALLOWED_PATHS)};
              var path = window.location.pathname.replace(/\\/$/, '') || '/';
              if (allowed.indexOf(path) === -1) {
                window.location.replace('/');
              }
            })();
          `,
        }}
      />
    );
  }

  setHeadComponents(headComponents);
};
