import { Form } from "./Form";
import { fetchJson } from "../scripts/Fetch";
import { useState } from "react";

export function AddChannel(props) {
  const [serverMessage, setServerMessage] = useState("");
  const [addedUsers, setAddedUsers] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    setServerMessage("");
    const formData = new FormData(event.target);
    const body = Object.fromEntries(formData);
    body.users = addedUsers;
    const response = await fetchJson("/channel", "POST", body);

    setServerMessage(await response.text());
  }

  function onBlackClick(event) {
    if (event.target.className === "black-background") {
      setAddedUsers([]);
      props.setAdd(false);
    }
  }

  return (
    <div className="black-background" onClick={onBlackClick}>
      <Form
        title="Add channel"
        className="add-channel-form"
        onSubmit={onSubmit}
        serverMessage={serverMessage}
        content={
          <>
            <input name="name" placeholder="Channel name (Optional)" />
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
                setAddedUsers([]);
                props.setAdd(false);
              }}>
              Cancel
            </button>
          </>
        }
      />
    </div>
  );
}
