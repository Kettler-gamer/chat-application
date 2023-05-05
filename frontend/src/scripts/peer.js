import info from "../scripts/userinfo";
import { Peer } from "peerjs";

export function setupPeerConnection(
  username,
  setCall,
  setCaller,
  setGroupCall,
  setCurrentGroup,
  setGroupCalling,
  setVideoStreams
) {
  window.peer = new Peer(username, {
    host: "/",
    debug: 1,
    port: 3001,
    token: sessionStorage.getItem("jwtToken"),
    path: "/peerjs",
  });
  window.peer.on("connection", (connection) => onConnection(connection));

  window.peer.on("error", (error) =>
    onError(error, setCurrentGroup, setGroupCall, setCall, setCaller)
  );

  window.peer.on("call", (call) =>
    onCall(
      call,
      setGroupCalling,
      setCurrentGroup,
      setGroupCall,
      setVideoStreams,
      setCaller
    )
  );

  info.peer = window.peer;
  navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
    window.localStream = stream;
    window.localAudio.srcObject = stream;
  });
}

function onConnection(connection) {
  if (info.conn) {
    console.log("Already in a call!");
    setTimeout(() => {
      connection.close();
    }, 500);
    return;
  } else if (connection.metadata?.connectionType === "channel") {
    console.log("Channel connection!");
    info.conns.push(connection);
  } else {
    console.log(connection.metadata);
    info.conn = connection;
    connection.on("close", () => {
      console.log("Close connection!");
      if (info.currentCall) {
        info.currentCall.close();
        info.conn = undefined;
      }
    });
  }
}

function onError(error, setCurrentGroup, setGroupCall, setCall, setCaller) {
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
}

function onCall(
  call,
  setGroupCalling,
  setCurrentGroup,
  setGroupCall,
  setVideoStreams,
  setCaller
) {
  if (!call.metadata || info.currentCall) return call.close();
  console.log(call.metadata);
  const { callType } = call.metadata;
  if (callType === "channel") {
    console.log("Channel call!");
    if (info.calls.length > 0) {
      console.log("Info.calls has calls!");
      if (info.answered) {
        console.log("Info.answered is true!");
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
      console.log("Info.calls is empty!");
      console.log(call.metadata);
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
  } else if (callType === "private") {
    if (call.metadata.streamType === "video" && info.currentCall) {
      info.currentVideoCall = call;
      call.on("stream", (stream) => {
        console.log("Video stream!");
        info.currentVideoStream = stream;
        setVideoStreams((oldValue) => [...oldValue, stream]);
      });
      call.answer();
    } else {
      setCaller(call.peer);
      info.currentCall = call;
    }
  }
}

export function onStream(stream) {
  console.log("stream");
  window.remoteAudio.srcObject = stream;
  window.remoteAudio.autoplay = true;
  window.peerStream = stream;
  window.localStream.getTracks()[0].enabled = true;
}

export function onChannelCallClose(props, newConn) {
  props.setCurrentGroup((oldValue) =>
    oldValue.filter((user) => user.username !== newConn.peer)
  );
  info.conns.splice(newConn, 1);
  console.log(info.conns);
  if (info.conns.length === 0) {
    info.calls = [];
    info.peerStreams = [];
    info.remoteAudios = [];
    delete info.answered;
    delete info.answeredPeople;
    props.setCurrentGroup([]);
    props.setGroupCall(false);
    window.peer._connections.clear();
  }
}

export function onChannelCallData(data, newConn) {
  console.log("Peer data!");
  console.log(data);
  if (data === "checkCallers") {
    newConn.send({
      command: "callers",
      answeredPeople: info.answeredPeople,
    });
  }
}

export function onChannelCallStream(stream, props, contact) {
  console.log("Got stream from " + contact);
  info.answeredPeople.push(contact);
  const audioStream = new Audio();
  audioStream.srcObject = stream;
  audioStream.autoplay = true;
  info.peerStreams.push(stream);
  info.remoteAudios.push(audioStream);
  window.localStream.getTracks()[0].enabled = true;
  props.setCurrentGroup((oldValue) => {
    const newValue = JSON.parse(JSON.stringify(oldValue));

    const foundValue = newValue.find((user) => user.username === contact);

    if (foundValue) {
      foundValue.answered = true;
    }

    return newValue;
  });
  info.conns.forEach((conn) => {
    conn.send({ command: "answer", username: contact });
  });
}

export function onPrivateCallAnswer(props) {
  info.currentCall.answer(window.localStream);

  info.currentCall.on("stream", onStream);

  info.currentCall.on("close", () => {
    console.log("Call close");
    props.setCall(false);
    props.setCaller("");
    props.setVideoStreams([]);
    info.localVideoStream = undefined;
    info.currentVideoStream = undefined;
    info.currentCall = undefined;
    window.localStream.getTracks()[0].enabled = true;
  });
  props.setCall(true);
}
