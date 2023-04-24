import "dotenv/config";
import express from "express";
import router from "./src/routes/router.js";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

app.use(express.json());

app.use(router);

const server = createServer(app);
const io = new Server(server);

io.on("connection", (ws) => {
  console.log("Someone connected!");
});

server.listen(process.env.PORT, () =>
  console.log("Server is listening on port: ", process.env.PORT)
);
