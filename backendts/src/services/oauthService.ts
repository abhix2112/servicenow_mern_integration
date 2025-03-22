import { AuthorizationCode } from "simple-oauth2";
import type { AccessToken, Token } from "simple-oauth2";
import { config } from "../config/env";

// Validate required environment variables
if (!config.instance || !config.clientID || !config.ClientSecret || !config.redirecturi) {
  throw new Error("Missing required environment variables for OAuth configuration");
}

// OAuth2 Client Configuration
const oauth2 = new AuthorizationCode({
  client: {
    id: config.clientID,
    secret: config.ClientSecret,
  },
  auth: {
    tokenHost: config.instance,
    authorizePath: "/oauth_auth.do",
    tokenPath: "/oauth_token.do",
  },
});

export class OAuthService {
  /**
   * Generates the OAuth Authorization URL
   */
  static getAuthUrl(state: string): string {
    return oauth2.authorizeURL({
      redirect_uri: config.redirecturi!,
      scope: "user_profile",
      state,
    });
  }

  /**
   * Exchanges Authorization Code for Access & Refresh Tokens
   */
  static async exchangeCodeForToken(code: string): Promise<AccessToken | null> {
    try {
      const tokenParams = {
        code,
        redirect_uri: config.redirecturi!,
      };

      const result = await oauth2.getToken(tokenParams);
      return result;
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      return null;
    }
  }

  /**
   * Refreshes an Expired Access Token
   */
  static async refreshAccessToken(refreshToken: string): Promise<string | null> {
    try {
      const result = await oauth2.getToken({
        code: refreshToken,
        redirect_uri: config.redirecturi!,
      });
      const token = result.token as Token;
      if (typeof token.access_token === 'string') {
        return token.access_token;
      }
      return null;
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  }
}
