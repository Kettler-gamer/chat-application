import { fetchJson } from "../scripts/Fetch";
import { Form } from "./Form";
import { useState } from "react";

export function Channel(props) {
  const [add, setAdd] = useState(false);
  const [currentUsers, setCurrentUsers] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);
  const [serverMessage, setServerMessage] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setServerMessage("");
    // const response = await fetchJson("/channel", "PATCH", addedUsers);
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
                <button>Create</button>
                <button
                  type="button"
                  onClick={() => {
                    setAdd(false);
                  }}>
                  Cancel
                </button>
              </>
            }
          />
        </div>
      )}
    </>
  );
}
