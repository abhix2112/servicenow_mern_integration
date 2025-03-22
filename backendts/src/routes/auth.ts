import { Router, RequestHandler } from "express";
import { Session } from "express-session";
import crypto from "crypto";
import { OAuthService } from "../services/oauthService";
import cookieParser from "cookie-parser";

const router = Router();

interface SessionWithOAuth extends Session {
  oauthState?: string;
}

router.use(cookieParser());

/**
 * Step 1: Redirect user to OAuth login
 */
const loginHandler: RequestHandler = (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  (req.session as SessionWithOAuth).oauthState = state;
  res.redirect(OAuthService.getAuthUrl(state));
};


/**
 * Step 2: OAuth callback - Exchange code for token
 */
const callbackHandler: RequestHandler = async (req, res, next) => {
  try {
    const { code, state } = req.query;
    const session = req.session as SessionWithOAuth;

    if (!code || state !== session.oauthState) {
      res.status(400).send("Invalid state or missing code.");
      return;
    }

    const token = await OAuthService.exchangeCodeForToken(code as string);
    if (!token) {
      res.status(500).send("Failed to get access token");
      return;
    }

    res.cookie("access_token", token.token.access_token, { httpOnly: true });
    res.cookie("refresh_token", token.token.refresh_token, { httpOnly: true });
    res.redirect("/profile");
  } catch (error) {
    next(error);
  }
};

/**
 * Step 3: Protected Route - Fetch user profile
 */
const profileHandler: RequestHandler = async (req, res, next) => {
  try {
    let accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    if (!accessToken) {
      if (!refreshToken) {
        res.status(401).send("Unauthorized: No access or refresh token");
        return;
      }

      console.log("Access token expired. Trying to refresh...");
      accessToken = await OAuthService.refreshAccessToken(refreshToken);

      if (!accessToken) {
        res.status(401).send("Unauthorized: Unable to refresh token");
        return;
      }

      res.cookie("access_token", accessToken, { httpOnly: true });
    }

    res.json({ message: "User profile data fetched", accessToken });
  } catch (error) {
    next(error);
  }
};

/**
 * Step 4: Logout - Clear tokens
 */
const logoutHandler: RequestHandler = (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.send("Logged out successfully.");
};

// Define Routes
router.get("/", loginHandler);
router.get("/callback", callbackHandler);
router.get("/profile", profileHandler);
router.get("/logout", logoutHandler);

export default router;
