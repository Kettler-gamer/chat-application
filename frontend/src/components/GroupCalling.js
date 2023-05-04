import { info } from "../pages/MainPage";
import { useEffect, useState } from "react";

export function GroupCalling(props) {
  const [mute, setMute] = useState(false);

  function onGroupClose(connection) {
    console.log("Connection close!");
    const connectionIndex = info.conns.indexOf(connection);
    console.log(connectionIndex);
    if (connectionIndex >= 0) {
      info.conns.splice(connectionIndex, 1);
      if (info.conns.length === 0) {
        info.calls = [];
        info.peerStreams = [];
        info.remoteAudios = [];
        delete info.answered;
        delete info.answeredPeople;
        props.setGroupCall(false);
        props.setGroupCalling("calling");
        props.setUsers([]);
        window.peer._connections.clear();
      }
    }
  }

  function onPeerData(data) {
    console.log("PEER data");
    console.log(data);
    if (data.command === "callers") {
      console.log("Username: " + props.username);
      const callUsers = data.answeredPeople.filter(
        (name) => name !== props.username
      );
      console.log(callUsers);
      callUsers.forEach((user) => {
        console.log("Calling: " + user);
        const newConn = window.peer.connect(user);
        info.conns.push(newConn);
        newConn.on("close", () => onGroupClose(newConn));
        const newCall = window.peer.call(user, window.localStream, {
          metadata: { group: "Test" },
        });
        newCall.on("stream", (stream) => {
          console.log(`Got stream from ${user}`);
          const audioStream = new Audio();
          audioStream.srcObject = stream;
          audioStream.autoplay = true;
          info.peerStreams.push(stream);
          info.remoteAudios.push(audioStream);
        });
        info.calls.push(newCall);
      });
      props.setUsers((oldValue) => {
        const newValue = JSON.parse(JSON.stringify(oldValue));

        const answeredUsers = newValue.filter((user) =>
          data.answeredPeople.includes(user.username)
        );

        answeredUsers.forEach((user) => {
          user.answered = true;
        });

        return newValue;
      });
    } else if (data.command === "userDC") {
      props.setUsers((oldValue) =>
        oldValue.filter((user) => user.username !== data.username)
      );
    } else if (data.command === "answer") {
      console.log(data);
      props.setUsers((oldValue) => {
        const newValue = JSON.parse(JSON.stringify(oldValue));

        newValue.find(
          (user) => user.username === data.username
        ).answered = true;

        return newValue;
      });
    }
  }

  function onAnswer() {
    console.log(info);
    info.answered = true;
    info.calls[0].answer(window.localStream);
    info.calls[0].on("stream", (stream) => {
      console.log(`Got stream from ${info.calls[0].peer}`);
      const audioStream = new Audio();
      audioStream.srcObject = stream;
      audioStream.autoplay = true;
      info.peerStreams.push(stream);
      info.remoteAudios.push(audioStream);
      window.localStream.getTracks()[0].enabled = true;
    });
    console.log(info.conns);
    info.conns[0].on("close", () => onGroupClose(info.conns[0]));
    info.conns[0].on("data", (data) => onPeerData(data));
    props.setUsers((oldValue) => {
      const newValue = JSON.parse(JSON.stringify(oldValue));

      newValue.find(
        (user) => user.username === info.conns[0].peer
      ).answered = true;

      return newValue;
    });
    info.conns[0].send("checkCallers");
    props.setGroupCalling("calling");
  }

  function onDecline() {
    info.conns.forEach((conn) => {
      conn.close();
    });
    info.calls.forEach((call) => {
      call.close();
    });
    props.setGroupCall(false);
    props.setGroupCalling("calling");
  }

  function onMute() {
    console.log("muteClick");
    const track = window.localStream.getTracks()[0];

    track.enabled = !track.enabled;
    setMute((oldValue) => !oldValue);
  }

  function endCall() {
    info.calls.forEach((call) => call.close());
    info.conns.forEach((conn) => conn.close());
    info.calls = [];
    info.conns = [];
    info.peerStreams = [];
    info.remoteAudios = [];
    delete info.answered;
    props.setGroupCall(false);
    props.setGroupCalling("calling");
    console.log("End call");
  }

  useEffect(() => {
    if (props.users.length === 1) {
      props.setGroupCall(false);
      props.setGroupCalling("calling");
    }
  }, [props, props.users]);

  return (
    <div className="call group-calling">
      {props.groupCalling === "calling" && (
        <>
          {props.users.map((user) => (
            <p
              key={`group-chat-names-${user.username}`}
              style={
                !user.answered && props.username !== user.username
                  ? { color: "grey" }
                  : {}
              }>
              {user.username}
              {props.username !== user.username &&
                (user.answered ? " On Call" : " Calling...")}
            </p>
          ))}
          <button
            onClick={onMute}
            style={mute ? { backgroundColor: "red" } : {}}>
            Mute
          </button>
          <button onClick={endCall}>End call</button>
        </>
      )}
      {props.groupCalling === "recieving" && (
        <>
          {props.users.map((user) => (
            <p key={`recieving-${user.username}`}>{user.username}</p>
          ))}
          <button onClick={onAnswer}>Answer</button>
          <button onClick={onDecline}>Decline</button>
        </>
      )}
    </div>
  );
}
