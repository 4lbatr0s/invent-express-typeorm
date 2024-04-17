import express from "express";
import helmet from "helmet";
import config from "./config/index.js";
import loaders from "./loaders/index.js";
import fileUpload from "express-fileupload";
import path from 'path';
import { fileURLToPath } from "url";
import loadRoutes from "./api-routes/index.js";
import globalErrorHandler from "./middlewares/error.js";
import ApiError from "./errors/ApiError.js";
import httpStatus from "http-status";
import Messages from "./scripts/utils/messages.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startServer = async () => {
  try {
    await config();
    await loaders();
    
    const app = express();
    app.use('/uploads', express.static(path.join(__dirname, './', 'uploads')));
    app.use(express.json());
    app.use(helmet());
    app.use(fileUpload());
    loadRoutes(app);
    
    app.use((req, res, next) => {
      const error = new ApiError(Messages.ERROR.PAGE_NOT_FOUND, httpStatus.NOT_FOUND);
      next(error);
    });

    app.use(globalErrorHandler);
    
    app.listen(process.env.APP_PORT, () => {
      console.log(`Server is listening on port: ${process.env.APP_PORT}` );
    });
  } catch (error) {
    console.error("Error during initialization:", error);
    process.exit(1); // Exit the process if initialization fails
  }
};

startServer();
