const express = require("express");
const axios = require("axios"); // Import axios
require("dotenv").config();

// Fetch user details
async function fetchUser(accessToken) {
  try {
    const response = await axios.get(
      `${process.env.SERVICENOW_INSTANCE}/api/now/table/sys_user`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        params: {
          sysparm_query: "user_name=javascript:gs.getUserName()", // Use env variable or pass it dynamically
          sysparm_limit: 1,
        },
      }
    );
    return response; // Return fetched data
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    return null;
  }
}

module.exports = fetchUser;
