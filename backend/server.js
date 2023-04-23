import "dotenv/config";
import express from "express";

import router from "./src/routes/router.js";

const app = express();

app.use(express.json());

app.use(router);

app.listen(process.env.PORT, () =>
  console.log("Server is listening on port: ", process.env.PORT)
);
