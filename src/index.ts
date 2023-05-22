import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rootHandler, purchaseHandler } from "./controller";

const port = "8000";

export const createApp = async () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.get("/", rootHandler);
 
  app.post("/purchase", purchaseHandler);

  return app;
};

createApp().then((app) => {
  app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
  });
});