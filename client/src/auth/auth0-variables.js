const callbackUrl =
  process.env.NODE_ENV === "production"
    ? "https://okini-arts.herokuapp.com/callback"
    : "http://localhost:3000/callback";
export const AUTH_CONFIG = {
  domain: "okiniarts.auth0.com",
  clientId: "JBfFodKF3HidREciZunc_0u1OX8PaKhO",
  callbackUrl: callbackUrl,
};
