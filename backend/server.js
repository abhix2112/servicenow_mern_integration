const express = require("express");
const session = require("express-session");
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");
const fetchUser = require("/Servicenow_node/backend/Routes/profile.js");
const { use } = require("passport");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// Middleware: Session Management
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 24 * 60 * 60 * 1000 },
  })
);

// OAuth2 Login Route - Redirect to ServiceNow Authorization Page
app.get("/auth", (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");
  req.session.oauthState = state; // Store state in session

  const authUrl =
    `${process.env.SERVICENOW_INSTANCE}/oauth_auth.do` +
    `?response_type=code&client_id=${process.env.CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}` +
    `&state=${state}`;

  res.redirect(authUrl);
});

// OAuth2 Callback - Exchange Authorization Code for Access Token
app.get("/auth/callback", async (req, res) => {
  const { code, state } = req.query;

  if (!code || state !== req.session.oauthState) {
    return res.status(400).send("Invalid state or missing code.");
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      `${process.env.SERVICENOW_INSTANCE}/oauth_token.do`,
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        code: code,
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenResponse.data.access_token;
    req.session.accessToken = accessToken; // Store token in session

    try {
      const userdata = await fetchUser(accessToken);
      console.log(userdata);
      if (!userdata) {
        console.error("Failed to Load the Data");
      } else {
        if (userdata.data.result.length > 0) {
          req.session.user = userdata.data.result[0]; // Store user in session
          res.redirect("/dashboard");
        } else {
          res.redirect("/");
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error);
      res.status(500).send("Failed to fetch user data.");
    }
  } catch (error) {
    console.error("OAuth Error:", error.response?.data || error);
    res.status(500).send("Authentication failed.");
  }
});
// Home Route (Login Button)
app.get("/", (req, res) => {
  const logoutMessage = "You have logged out successfully.";

  if (req.query.logout) {
    res.send(
      `<p>${logoutMessage}</p><a href="/auth">Login with ServiceNow</a>`
    );
  } else {
    res.send('<a href="/auth">Login with ServiceNow</a>');
  }
});

// Dashboard Route (Protected)
app.get("/dashboard", (req, res) => {
  // Check if the authorization header is missing
  if (!req.session.user) {
    return res.redirect("/"); // Redirect to the homepage if not authorized
  }
  res.send(`Welcome, ${req.session.user.user_name}!`); // Greet the user by their username
});

// Logout Route
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/?logout=true");
  });
});

app.get("/profile", (req, res) => {
  const udata = req.session.user;
  if (udata) {
    res.send(JSON.stringify(udata));
  } else {
    return res.redirect('/');
  }
  
});

// Start Server
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
