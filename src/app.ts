import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
import { PORT, MONGO_URI, NODE_ENV } from "./utils/constant";
import { API_ENDPOINT_NOT_FOUND_ERR, SERVER_ERR } from "./utils/error";
// import router from "./routes/index";
import { ConnectionOptions } from "tls";
import bodyParser from "body-parser";

import path from "path";
dotenv.config({ path: "../.env" });

// Initiate express app
const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: `http://localhost:${PORT || 5000}`,
    optionsSuccessStatus: 200,
  })
);

if (NODE_ENV === "development") {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

// Apply middlewares
app.use(
  bodyParser.json({ limit: "1024mb" }),
  bodyParser.urlencoded({
    limit: "1024mb",
    extended: true,
  }),
  cors()
  // morgan('dev')
);

// Serve static files
const staticPath = path.join(__dirname, "..", "uploads"); // Define the path to your static files
app.use("/uploads", express.static(staticPath));

// Welcome route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    type: "SUCCESS",
    message: "SERVER IS UP AND RUNNING",
    data: null,
  });
});

// Routes
// app.use("/", router);

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  const error = {
    status: 404,
    message: API_ENDPOINT_NOT_FOUND_ERR,
  };
  next(error);
});

// Global error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  const status = err.status || 500;
  const message = err.message || SERVER_ERR;
  const data = err.data || null;
  res.status(status).json({
    type: "error",
    message,
    data,
  });
});

async function connectDb() {
  try {
    await mongoose.connect(MONGO_URI, <ConnectionOptions>{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
    });

    console.log("database connected");

    app.listen(PORT || 5000, () =>
      console.log(`Server listening on port ${PORT}`)
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

connectDb();
