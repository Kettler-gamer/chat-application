import { info } from "../pages/MainPage";
import { Peer } from "peerjs";

export function setupPeerConnection(username, setCall, setCaller) {
  window.peer = new Peer(username, {
    host: "/",
    debug: 1,
    port: 3001,
    token: sessionStorage.getItem("jwtToken"),
    path: "/peerjs",
  });
  window.peer.on("connection", (connection) => {
    console.log("Peer connection!");
    info.conn = connection;
    connection.on("close", () => {
      console.log("Close connection!");
      setCall(false);
      setCaller("");
      window.localStream.getTracks()[0].enabled = true;
    });
  });
  window.peer.on("error", (error) => {
    console.log(error.message);
    if (error.message.includes("Could not connect to peer")) {
      setCall(false);
      setCaller("");
    } else if (error.message.includes("Lost connection to server")) {
      console.log("Lost PEER server connection!");
      setTimeout(() => {
        window.peer.reconnect();
      }, 5000);
    }
  });
  window.peer.on("call", (call) => {
    setCaller(call.peer);
    info.currentCall = call;
  });
  info.peer = window.peer;
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    window.localStream = stream;
    window.localAudio.srcObject = stream;
  });
}

export function onStream(stream) {
  console.log("stream");
  window.remoteAudio.srcObject = stream;
  window.remoteAudio.autoplay = true;
  window.peerStream = stream;
  window.localStream.getTracks()[0].enabled = true;
}
