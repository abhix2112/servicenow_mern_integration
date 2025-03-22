import { Router, RequestHandler } from "express";
import axios from "axios";
import { config } from "../config/env";

const router = Router();

interface SessionWithOAuth {
  servicenow_user_token?: string;
}
//as tjere is no access token here so we have created a intergration user in servicenow it will create the record in system
async function userapplied(data: any) {
    try {
        const url = `${config.instance}/api/now/table/x_984044_empowerhr_hr_applications`;
        const response = await axios.post(url, 
            {
                "applied_job": data.jobnumber,
                "candidate_name": data.name,
                "email": data.email,
                "phone_number": data.phone,
                "data": data.resume_parsed
            }, 
            {
                headers: {
                    'Authorization': `Basic ${config.servicenow_user_token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                params: {
                    sysparm_fields: "sys_id,number"
                }
            }
        );

        if (response.data && response.data.result) {
            const sys_id = response.data.result.sys_id;
            await uploadattachment('x_984044_empowerhr_hr_applications', sys_id, data.resume_url, data);
            return response.data;
        } else {
            throw new Error("Invalid response from ServiceNow");
        }
    } catch (error: any) {
        console.error("ServiceNow API Error:", error.response?.data || error.message);
        throw error;
    }
}

async function uploadattachment(tablename: string, sys_id: string, resume_url: string, data: any) {
    try {
        const url = `${config.instance}/api/now/attachment/file`;
        const filename = `${data.name}_Resume.pdf`;
        
        const response = await axios.post(
            url,
            {
                table_name: tablename,
                table_sys_id: sys_id,
                file_name: filename,
                file_url: resume_url
            },
            {
                headers: {
                    'Authorization': `Basic ${config.servicenow_user_token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status !== 200) {
            throw new Error("Failed to upload attachment");
        }
        return response.data;
    } catch (error: any) {
        console.error("Attachment Upload Error:", error.response?.data || error.message);
        throw error;
    }
}

export default userapplied;
