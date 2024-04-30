/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ["/"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to the dashboard
 * @type {string[]}
 */
export const authRoutes = ["/login", "/verify-email"];

/**
 * The prefix for api authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * An array of routes that are used for onboarding
 * @type {string[]}
 */
export const onboardingRoutes = ["/onboarding"];

/**
 * The default route to redirect to after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/documents";
