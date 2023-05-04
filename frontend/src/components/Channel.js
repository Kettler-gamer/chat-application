import { fetchJson } from "../scripts/Fetch";
import { Form } from "./Form";
import { useState } from "react";
import { Confirm } from "./Confirm";
import { info } from "../pages/MainPage";

export function Channel(props) {
  const [add, setAdd] = useState(false);
  const [leave, setLeave] = useState(false);
  const [currentUsers, setCurrentUsers] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);
  const [serverMessage, setServerMessage] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setServerMessage("");
    const body = {
      users: addedUsers,
      channelId: props.channelId,
    };
    const response = await fetchJson("/channel", "PATCH", body);

    if (response.status < 400) {
      setCurrentUsers((oldValue) => [...oldValue, ...addedUsers]);
      setAddedUsers([]);
    }

    setServerMessage(await response.text());
  }

  async function onLeaveChannel() {
    console.log(props.channelId);
    const response = await fetchJson(
      `/channel/leave?channelId=${props.channelId}`,
      "GET"
    );

    if (response.status < 400) {
      console.log("Left channel");
      props.setProfile((oldValue) => {
        oldValue.channelIds.filter((id) => id !== props.channelId);
        return oldValue;
      });
      props.setChannels((oldValue) =>
        oldValue.filter((channel) => channel._id !== props.channelId)
      );
      props.setSelectedChannel(undefined);
      setLeave(false);
    } else {
      console.log("Something went wrong!");
    }
  }

  function onPlusClick() {
    setCurrentUsers(
      props.channels.find((channel, index) => index === props.channelNumber - 1)
        .users
    );
    setAdd(true);
  }

  function onBlackClick(event) {
    if (event.target.className === "black-background") {
      setAdd(false);
      setServerMessage("");
    }
  }

  function callClick() {
    const users = props.channels.find(
      (channel, index) => index === props.channelNumber - 1
    ).users;

    console.log(users);
    info.calls = [];
    info.remoteAudios = [];
    info.peerStreams = [];
    info.answeredPeople = [];
    users.forEach((contact) => {
      if (contact === props.profile.username) return;
      const newConn = window.peer.connect(contact, {
        metadata: { connectionType: "channel" },
      });
      newConn.on("disconnect", () => {
        console.log("Disconnect!");
      });
      newConn.on("close", () => {
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
      });
      newConn.on("data", (data) => {
        console.log("Peer data!");
        console.log(data);
        if (data === "checkCallers") {
          newConn.send({
            command: "callers",
            answeredPeople: info.answeredPeople,
          });
        }
      });
      info.conns.push(newConn);
      const currentCall = window.peer.call(contact, window.localStream, {
        metadata: {
          callType: "channel",
          users,
          caller: props.profile.username,
        },
      });
      info.calls.push(currentCall);
      currentCall.on("stream", (stream) => {
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
          console.log(newValue);
          console.log(contact);
          const foundValue = newValue.find((user) => user.username === contact);

          console.log(foundValue);
          if (foundValue) {
            foundValue.answered = true;
          }

          return newValue;
        });
        info.conns.forEach((conn) => {
          conn.send({ command: "answer", username: contact });
        });
      });
    });
    props.setCurrentGroup(
      users.map((username) => ({ username, answered: false }))
    );
    props.setGroupCall(true);
  }

  return (
    <>
      <div className="contact-top">
        <p>{props.name || `Channel ${props.channelNumber}`}</p>
        <div className="contact-btns">
          <button className="add-btn" onClick={onPlusClick}>
            +
          </button>
          <button onClick={() => setLeave(true)}>
            <img src="/images/door.webp" alt="door" />
          </button>
          <button onClick={callClick}>📞</button>
        </div>
      </div>
      {add && (
        <div className="black-background" onClick={onBlackClick}>
          <Form
            title="Add users"
            className="add-channel-form"
            onSubmit={onSubmit}
            serverMessage={serverMessage}
            content={
              <>
                <p>Current users: {currentUsers.length}</p>
                <ul className="added-list">
                  {currentUsers.map((user, index) => (
                    <li key={`currentUser-${index}`}>
                      <p>{user}</p>
                    </li>
                  ))}
                </ul>
                <p>Added users: {addedUsers.length}</p>
                <ul className="added-list">
                  {addedUsers.map((user, index) => (
                    <li key={`addedUser-${index}`}>
                      <p>{user}</p>
                      <button
                        className="add-btn"
                        type="button"
                        onClick={() =>
                          setAddedUsers((oldValue) =>
                            oldValue.filter((name) => name !== user)
                          )
                        }>
                        -
                      </button>
                    </li>
                  ))}
                </ul>
                <p>Contacts</p>
                <ul className="channel-add-contact-list">
                  {props.profile.contacts
                    .filter(
                      (contact) => !currentUsers.includes(contact.username)
                    )
                    .filter((contact) => !addedUsers.includes(contact.username))
                    .map((contact, index) => (
                      <li key={`addUser-${index}`}>
                        <p>{contact.username}</p>
                        <button
                          className="add-btn"
                          type="button"
                          onClick={() =>
                            setAddedUsers((oldValue) => [
                              ...oldValue,
                              contact.username,
                            ])
                          }>
                          +
                        </button>
                      </li>
                    ))}
                </ul>
              </>
            }
            buttons={
              <>
                <button>Add</button>
                <button
                  type="button"
                  onClick={() => {
                    setAddedUsers([]);
                    setServerMessage("");
                    setAdd(false);
                  }}>
                  Cancel
                </button>
              </>
            }
          />
        </div>
      )}
      {leave && (
        <Confirm
          title="Do you want to leave the channel?"
          onConfirm={onLeaveChannel}
          onCancel={() => {
            setLeave(false);
          }}
        />
      )}
    </>
  );
}
