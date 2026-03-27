import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();

/**
 * @param {string} idToken - Google ID token (credential) from the client
 * @returns {Promise<{ email: string, name: string }>}
 */
export async function verifyGoogleIdToken(idToken) {
  const audience = process.env.GOOGLE_CLIENT_ID;
  if (!audience) {
    throw new Error("GOOGLE_CLIENT_ID is not configured");
  }

  const ticket = await client.verifyIdToken({
    idToken,
    audience,
  });

  const payload = ticket.getPayload();
  if (!payload?.email) {
    throw new Error("Invalid Google token: missing email");
  }
  if (payload.email_verified === false) {
    throw new Error("Google email not verified");
  }

  return {
    email: payload.email,
    name: payload.name || payload.email.split("@")[0],
  };
}
