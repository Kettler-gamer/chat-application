import { fetchJson } from "../scripts/Fetch";
import { Form } from "./Form";
import { useState } from "react";
import { Confirm } from "./Confirm";

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
    const response = await fetchJson(
      `/channel/leave?channelId=${props.channelId}`,
      "GET"
    );

    if (response.status < 400) {
      console.log("Left channel");
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
    }
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
          onCancel={() => setLeave(false)}
        />
      )}
    </>
  );
}
