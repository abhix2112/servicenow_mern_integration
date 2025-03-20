import axios from "axios";
import { config } from "../config/env";

export class OAuthService {
  static getAuthUrl(state: string): string {
    if (!config.redirecturi) {
      throw new Error("Redirect URI is required but not provided in environment variables");
    }
    return `${config.instance}/oauth_auth.do?response_type=code&client_id=${
      config.clientID
    }&redirect_uri=${encodeURIComponent(config.redirecturi)}&state=${state}`;
  }

  static async exchangeCodeForToken(code: string): Promise<string> {
    if (!config.redirecturi || !config.ClientSecret) {
      throw new Error("Redirect URI and Client Secret are required but not provided in environment variables");
    }
    const response = await axios.post(
      `${config.instance}/oauth_token.do`,
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: config.clientID,
        client_secret: config.ClientSecret,
        redirect_uri: config.redirecturi,
        code: code,
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    return response.data.access_token;
  }
}
