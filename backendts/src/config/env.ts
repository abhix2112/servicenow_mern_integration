import dotenv from "dotenv";
dotenv.config();
export const config = {
  instance: process.env.SERVICENOW_INSTANCE!,
  clientID: process.env.CLIENT_ID!,
  ClientSecret: process.env.CLIENT_SECRET,
  redirecturi: process.env.REDIRECT_URI,
  sessionSecret: process.env.SESSION_SECRET,
  port: process.env.PORT || 3000,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_ANON_KEY,
  supabaseStorageUrl: process.env.SUPABASE_STORAGE_URL,
  resumeParserApiKey: process.env.RESUME_PARSER_API_KEY,
  servicenow_user_token: process.env.Servicenow_user_token,
};

