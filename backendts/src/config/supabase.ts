import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase configuration is missing");
}

export const supabase = createClient(supabaseUrl, supabaseKey);




export interface UserApplication {
  name: string;
  email: string;
  phone: string;
  jobnumber: string;
  resume_url: string;
  created_at?: string;
}

export const uploadResume = async (file: Express.Multer.File) => {
  const { data, error } = await supabase.storage
    .from("resume")
    .upload(`public/${Date.now()}-${file.originalname}`, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) throw error;
  return data;
};

export const getPublicUrl = (path: string) => {
  const { data } = supabase.storage.from("resume").getPublicUrl(path);
  return data.publicUrl;
};

export const saveUserApplication = async (data: UserApplication) => {
  const { error } = await supabase
    .from("user_applied")
    .insert([data]);
  
  if (error) throw error;
}; 