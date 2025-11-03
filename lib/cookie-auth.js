// lib/cookie-auth.js
export const ACCESS_COOKIE = "niemr_access";
export const REFRESH_COOKIE = "niemr_refresh";

const oneDay = 60 * 60 * 24;
const isProd = process.env.NODE_ENV === "production";

export const cookieOptionsAccess = {
  httpOnly: true,
  sameSite: "lax",
  secure: false, // false on localhost (http), true in production (https)
  path: "/",
  maxAge: oneDay,
};

export const cookieOptionsRefresh = {
  httpOnly: true,
  sameSite: "lax",
  secure: false, // false on localhost (http), true in production (https)
  path: "/",
  maxAge: oneDay * 14,
};
