import { Form } from "./Form";
import { fetchJson } from "../scripts/Fetch";
import { useState } from "react";

export function AddContact(props) {
  const [serverMessage, setServerMessage] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setServerMessage("");
    const formData = new FormData(event.target);
    const body = Object.fromEntries(formData);

    const response = await fetchJson("/user", "PUT", body);

    if (response.status < 400) {
      const json = await response.json();
      props.setProfile((oldValue) => {
        const newVal = JSON.parse(JSON.stringify(oldValue));

        newVal.contacts = [...newVal.contacts, json.contact];

        return newVal;
      });
      return setServerMessage(json.message);
    }
    setServerMessage(await response.text());
  }

  function onBlackClick(event) {
    if (event.target.className === "black-background") {
      props.setAdd(false);
    }
  }

  return (
    <div className="black-background" onClick={onBlackClick}>
      <Form
        title="Add contact"
        onSubmit={onSubmit}
        serverMessage={serverMessage}
        content={
          <input name="contactName" placeholder="Contact name" required />
        }
        buttons={
          <>
            <button>Add</button>
            <button onClick={() => props.setAdd(false)}>Cancel</button>
          </>
        }
      />
    </div>
  );
}
