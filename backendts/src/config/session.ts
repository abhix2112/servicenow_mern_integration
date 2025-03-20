import session from "express-session";
import { config } from "./env";

if (!config.sessionSecret) {
  throw new Error("Session secret is required but not provided in environment variables");
}

export const sessionConfig = session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
});
