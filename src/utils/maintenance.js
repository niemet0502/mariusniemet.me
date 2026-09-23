const MAINTENANCE_MODE = true;

const ALLOWED_PATHS = ["/", "/maintenance"];

const normalizePath = (pathname) => {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/$/, "") || "/";
};

const isPathAllowed = (pathname) =>
  ALLOWED_PATHS.includes(normalizePath(pathname));

const BLOCKED_STATIC_PATHS = [
  "/home",
  "/about",
  "/articles",
  "/notes",
  "/reads",
  "/projects",
  "/404",
];

module.exports = {
  MAINTENANCE_MODE,
  ALLOWED_PATHS,
  BLOCKED_STATIC_PATHS,
  normalizePath,
  isPathAllowed,
};
