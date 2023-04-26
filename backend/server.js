import "dotenv/config";
import express from "express";
import router from "./src/routes/router.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { onSocketConnection } from "./src/io/ioHandler.js";
import { jwtCheck } from "./src/io/filter/jwtCheck.js";
import { ExpressPeerServer } from "peer";
import { setUpPeerEvents } from "./src/peer/peerHandler.js";

const app = express();

app.use(express.json({ limit: "50mb" }));

app.use(router);

const server = createServer(app);
const io = new Server(server);
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

setUpPeerEvents(peerServer);

app.use("/peerjs", peerServer);

io.use(jwtCheck);
io.on("connection", onSocketConnection);

server.listen(process.env.PORT, () =>
  console.log("Server is listening on port: ", process.env.PORT)
);
