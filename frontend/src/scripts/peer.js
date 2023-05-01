import { info } from "../pages/MainPage";
import { Peer } from "peerjs";

export function setupPeerConnection(
  username,
  setCall,
  setCaller,
  setGroupCall,
  setCurrentGroup,
  setGroupCalling
) {
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
    info.conns.push(connection);
    connection.on("close", () => {
      console.log("Close connection!");
      setCall(false);
      setCaller("");
      window.localStream.getTracks()[0].enabled = true;
    });
  });
  window.peer.on("error", (error) => {
    console.log(error.message);
    if (info.conns && info.conns.length > 0) {
      const username = error.message.split(" ")[5];
      info.conns.splice(info.conns.indexOf(username), 1);
      setCurrentGroup((oldValue) =>
        oldValue.filter((user) => user.username !== username)
      );
      if (info.conns.length === 0) return setGroupCall(false);

      info.conns.forEach((conn) => {
        conn.send({ command: "userDC", username });
      });
    } else {
      if (error.message.includes("Could not connect to peer")) {
        setCall(false);
        setCaller("");
      } else if (error.message.includes("Lost connection to server")) {
        console.log("Lost PEER server connection!");
        setTimeout(() => {
          window.peer.reconnect();
        }, 5000);
      }
    }
  });
  window.peer.on("call", (call) => {
    if (call.metadata) {
      console.log(call.metadata);
      if (info.calls.length > 0) {
        if (info.answered) {
          console.log("Answered, answering...");
          call.answer(window.localStream);
          call.on("stream", (stream) => {
            console.log("Got stream from " + call.peer);
            const audioStream = new Audio();
            audioStream.srcObject = stream;
            audioStream.autoplay = true;
            info.peerStreams.push(stream);
            info.remoteAudios.push(audioStream);
          });
          info.calls.push(call);
        }
      } else {
        setGroupCalling("recieving");
        setCurrentGroup(
          call.metadata.users.map((user) => ({
            username: user,
            answered: false,
          }))
        );
        setGroupCall(true);
        info.calls = [call];
        info.remoteAudios = [];
        info.peerStreams = [];
      }
    } else {
      setCaller(call.peer);
      info.currentCall = call;
    }
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
