export const ACCESS_COOKIE = "niemr_access";
export const REFRESH_COOKIE = "niemr_refresh";

const oneDay = 60 * 60 * 24;

export const cookieOptionsAccess = {
  httpOnly: true,
  sameSite: "lax",
  secure: true,
  path: "/",
  maxAge: oneDay, // match your access token TTL
};

export const cookieOptionsRefresh = {
  httpOnly: true,
  sameSite: "lax",
  secure: true,
  path: "/",
  maxAge: oneDay * 14, // typical refresh window
};
