import { info } from "../pages/MainPage";
import { useEffect } from "react";

export function GroupCalling(props) {
  function onAnswer() {
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
    info.conns[0].on("data", (data) => {
      console.log("PEER data");
      console.log(data);
      if (data.command === "callers") {
        const callUsers = data.answeredPeople.filter(
          (name) => name !== props.username
        );
        console.log(callUsers);
        callUsers.forEach((user) => {
          console.log("Calling: " + user);
          const newConn = window.peer.connect(user);
          info.conns.push(newConn);
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
        props.setUsers((oldValue) => {
          const newValue = JSON.parse(JSON.stringify(oldValue));

          newValue.find(
            (user) => user.username === data.username
          ).answered = true;

          return newValue;
        });
      }
    });
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

  useEffect(() => {
    if (props.users.length === 1) {
      props.setGroupCall(false);
      props.setGroupCalling("calling");
    }
  }, [props, props.users]);

  return (
    <div className="call group-calling">
      {props.groupCalling === "calling" &&
        props.users.map((user) => (
          <p
            key={`group-chat-names-${user.username}`}
            style={!user.answered ? { color: "grey" } : {}}>
            {user.username}
            {props.username !== user.username &&
              (user.answered ? " On Call" : " Calling...")}
          </p>
        ))}
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
