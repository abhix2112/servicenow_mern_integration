import dotenv from "dotenv";
dotenv.config();
export const config = {
  instance: process.env.SERVICENOW_INSTANCE!,
  clientID: process.env.CLIENT_ID!,
  ClientSecret: process.env.CLIENT_SECRET,
  redirecturi: process.env.REDIRECT_URI,
  sessionSecret: process.env.SESSION_SECRET,
  port: process.env.PORT || 3000,
};

