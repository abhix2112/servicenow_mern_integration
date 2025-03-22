import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { sessionConfig } from "./config/session";
import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";
import incidentRoutes from "./routes/incident";
import hrRoutes from "./routes/hr";
import { config } from "./config/env";
import hireRoutes from "./routes/hire";
const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(sessionConfig);

// Register Routes
app.get("/", (req, res) => {
    res.send("<a href='/auth'>Login With Servicenow</a>");
    
});

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/incident", incidentRoutes);
app.use("/createincident", incidentRoutes);
app.use("/incident/:id", incidentRoutes);
app.use("/hr", hrRoutes);
app.use("/hire", hireRoutes);

app.listen(config.port, () =>
  console.log(`Server running on http://localhost:${config.port}`)
);
