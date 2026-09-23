import "./src/styles/style.css";
require("prismjs/themes/prism-solarizedlight.css");

const { MAINTENANCE_MODE, isPathAllowed } = require("./src/utils/maintenance");

const redirectIfBlocked = (pathname) => {
  if (MAINTENANCE_MODE && !isPathAllowed(pathname)) {
    window.location.replace("/");
  }
};

export const onClientEntry = () => {
  redirectIfBlocked(window.location.pathname);
};

export const onRouteUpdate = ({ location }) => {
  redirectIfBlocked(location.pathname);
};
