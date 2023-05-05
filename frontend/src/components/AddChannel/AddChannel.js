import { Form } from "../Form";
import { fetchJson } from "../../scripts/Fetch";
import { useState } from "react";
import { AddedUsers } from "./AddedUsers";
import { ContactsList } from "./ContactsList";

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
            <AddedUsers addedUsers setAddedUsers />
            <ContactsList props addedUsers setAddedUsers />
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
