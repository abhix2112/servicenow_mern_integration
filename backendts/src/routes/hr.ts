import { Router, RequestHandler } from "express";
import axios from "axios";
import { config } from "../config/env";

const router = Router();

interface SessionWithOAuth {
  accessToken?: string;
}

//fetch hr cases of user

const gethrcases: RequestHandler = async (req, res, next) => {
  try {
    const session = req.cookies.access_token;
    if (!session) {
      res.status(401).send("No access token found" + session);
      return;
    }
    const url = `${config.instance}/api/now/table/sn_hr_core_case`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session}`,
        Accept: "application/json",
      },
      params: {
        sysparm_query: "subject_person=javascript:gs.getUserID()",
        sysparm_limit: 10,
        sysparm_display_value: true,
        sysparm_exclude_reference_link: true,
        sysparm_suppress_pagination_header: true,
        sysparm_fields: "number,state,short_description,assigned_to,sys_id",
      },
    });
    res.json(response.data);
  } catch (error) {
    next(error);
  }
};

//function to fetch hr case by id

const gethrcasebyid: RequestHandler = async (req, res, next) => {
  try {
      const session = req.cookies.access_token;
      if (!session) {
        res.status(401).send("No access token found" + session);
        return;
      }
      const url = `${config.instance}/api/now/table/sn_hr_core_case/${req.params.id}`;
      const response = await axios.get(url, {
        headers: {  
          Authorization: `Bearer ${session}`,
          Accept: "application/json",
        },
        params: {
          sysparm_display_value: true,
          sysparm_exclude_reference_link: true,
        },
      });
      res.json(response.data);

  } catch (error) {
    next(error);
  } 
};

router.get("/", gethrcases);
router.get("/:id", gethrcasebyid);

export default router;