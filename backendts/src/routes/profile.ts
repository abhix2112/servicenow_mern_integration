import { Router, RequestHandler } from "express";
import axios from "axios";
import { config } from "../config/env";

const router = Router();

interface SessionWithOAuth {
  accessToken?: string;
}

const getUser: RequestHandler = async (req, res, next) => {
  try {
    const session = req.cookies.access_token;;
    if (!session) {
      res.status(401).send("No access token found" + session);
      return;
    }

    const url = `${config.instance}/api/now/table/sys_user`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${session}`,
        Accept: "application/json",
      },
      params: {
        sysparm_query: "user_name=javascript:gs.getUserName()",
        sysparm_limit: 1,
      },
    });
    res.json(response.data);
  } catch (error) {
    next(error);
  }
};

router.get("/", getUser);

export default router;
