import { Router, RequestHandler } from "express";
import { Session } from "express-session";
import crypto from "crypto";
import { OAuthService } from "../services/oauthService";

const router = Router();

interface SessionWithOAuth extends Session {
  oauthState?: string;
  accessToken?: string;
}

const loginHandler: RequestHandler = (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  (req.session as SessionWithOAuth).oauthState = state;
  res.redirect(OAuthService.getAuthUrl(state));
};

const callbackHandler: RequestHandler = async (req, res, next) => {
  try {
    const { code, state } = req.query;
    const session = req.session as SessionWithOAuth;

    if (!code || state !== session.oauthState) {
      res.status(400).send("Invalid state or missing code.");
      return;
    }

    const accessToken = await OAuthService.exchangeCodeForToken(code as string);
    session.accessToken = accessToken;
    res.redirect("/profile");
  } catch (error) {
    console.error("OAuth Error:", error);
    next(error);
  }
};

router.get("/", loginHandler);
router.get("/callback", callbackHandler);

export default router;
