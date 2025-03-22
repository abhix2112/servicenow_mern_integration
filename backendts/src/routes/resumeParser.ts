import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function parseResume(filelink: string): Promise<any> {
  try {
    const response = await axios.get(
      `https://api.apilayer.com/resume_parser/url?url=${filelink}`,
      {
        headers: {
              apikey: process.env.RESUME_PARSER_API_KEY,
            
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error parsing resume:", error);
    throw error;
  }
}

export default parseResume;

