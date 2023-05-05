import info from "../../scripts/userinfo";
import { useEffect, useState } from "react";
import { onGroupCallStream } from "../../scripts/peer";
import { GroupCalling } from "./GroupCalling";
import { GroupCallRecieve } from "./GroupCallRecieve";

export function GroupCall(props) {
  const [mute, setMute] = useState(false);

  function onGroupClose(connection) {
    const connectionIndex = info.conns.indexOf(connection);
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

  function forCaller(user) {
    const newConn = window.peer.connect(user);
    info.conns.push(newConn);
    newConn.on("close", () => onGroupClose(newConn));
    const newCall = window.peer.call(user, window.localStream, {
      metadata: { group: "Test" },
    });
    newConn.on("error", (error) => {
      console.log(error);
    });
    newCall.on("stream", onGroupCallStream);
    newCall.on("error", (error) => {
      console.log(error);
    });
    info.calls.push(newCall);
  }

  function onCallersCommand(data) {
    const callUsers = data.answeredPeople.filter(
      (name) => name !== props.username
    );

    callUsers.forEach(forCaller);

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
  }

  function onUserDisconnectedCommand(data) {
    console.log("User DC");
    props.setUsers((oldValue) =>
      oldValue.filter((user) => user.username !== data.username)
    );
  }

  function onAnsweredCommand(data) {
    props.setUsers((oldValue) => {
      const newValue = JSON.parse(JSON.stringify(oldValue));

      newValue.find((user) => user.username === data.username).answered = true;

      return newValue;
    });
  }

  function onPeerData(data) {
    switch (data.command) {
      case "callers":
        onCallersCommand(data);
        break;
      case "userDC":
        onUserDisconnectedCommand(data);
        break;
      case "answer":
        onAnsweredCommand(data);
        break;
      default:
        console.log("Unkown peer command!");
    }
  }

  function onAnswer() {
    info.answered = true;

    info.calls[0].answer(window.localStream);

    info.calls[0].on("stream", (stream) => {
      onGroupCallStream(stream);
      window.localStream.getTracks()[0].enabled = true;
    });

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
        <GroupCalling
          users={props.users}
          username={props.username}
          onMute={onMute}
          mute={mute}
          endCall={endCall}
        />
      )}
      {props.groupCalling === "recieving" && (
        <GroupCallRecieve
          users={props.users}
          onAnswer={onAnswer}
          onDecline={onDecline}
        />
      )}
    </div>
  );
}
