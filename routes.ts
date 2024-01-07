/**
 * @description Public routes
 * This routes are not protected by the auth guard
 * @type {string[]}
 */
export const publicRoutes = ["/"];

/**
 * @description Auth routes
 * This routes are protected by the auth guard
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/new-verification",
  "/auth/new-password",
  "/auth/register",
  "/auth/login",
  "/auth/error",
  "/auth/reset",
];

/**
 * @description The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * @description The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT_URL = "/settings";
