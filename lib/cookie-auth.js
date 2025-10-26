// Centralized cookie helpers (server-side only)
export const ACCESS_COOKIE = "niemr_access";
export const REFRESH_COOKIE = "niemr_refresh";

export const cookieOptionsAccess = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  path: "/",
  maxAge: 60 * 60, // 1h (adjust to your access token lifetime)
};
export const cookieOptionsRefresh = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  path: "/",
  maxAge: 60 * 60 * 24 * 14, // 14 days
};
