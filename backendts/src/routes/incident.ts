import { Router, RequestHandler } from "express";
import axios from "axios";
import { config } from "../config/env";

const router = Router();

interface SessionWithOAuth {
  accessToken?: string;
}
//fuction to fetch all the incidents for the user
const getincidents: RequestHandler = async (req, res, next) => {
  try {
   const session = req.cookies.access_token;
   if (!session) {
     res.status(401).send("No access token found" + session);
     return;
   }

    const url = `${config.instance}/api/now/table/incident`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session}`,
        Accept: "application/json",
      },
      params: {
        sysparm_query: "caller_id=javascript:gs.getUserID()",
        sysparm_fields:
          "number,state,sys_created_by,short_description,sys_updated_by,active,assigned_to,comments_and_work_notes,urgency,priority",
        sysparm_limit: 10,
        sysparm_offset: 0,
        },
    });
    res.json(response.data);
  } catch (error) {
    next(error);
  }
};

//fuction to fetch particular incident for the user

const getincidentbyid: RequestHandler = async (req, res, next) => {
   try {
     const session = req.cookies.access_token;
     if (!session) {
       res.status(401).send("No access token found" + session);
       return;
     }

     const url = `${config.instance}/api/now/table/incident/${req.params.id}`;
     const response = await axios.get(url, {
       headers: {
         Authorization: `Bearer ${session}`,
         Accept: "application/json",
       },
     });
     res.json(response.data);
   } catch (error) {
     next(error);
   }
   
   
};

//function to create a incident 
const createincident: RequestHandler = async (req, res, next) => {
  try {
    const session = req.cookies.access_token;
    if (!session) {
      res.status(401).send("No access token found" + session);
      return;
    }
      const url = `${config.instance}/api/now/table/incident`;
      const response = await axios.post(url, req.body, {
        headers: {
          Authorization: `Bearer ${session}`,
          Accept: "application/json",
        },
      });
    res.json(response.data);
  } catch (error) {
    next(error);
  }
};

router.get("/", getincidents);
router.get("/:id", getincidentbyid);
router.post("/", createincident);
export default router;
