import { AddContact } from "./AddContact";
import { useState } from "react";

export function Contacts(props) {
  const [add, setAdd] = useState(false);

  return (
    <>
      <div className="contacts-section">
        <div className="contact-nav">
          <input placeholder="search.." />
          <button onClick={() => setAdd(true)}>+</button>
        </div>
        <ul className="contacts-list">
          {props.profile !== undefined && props.profile.contacts.length > 0 ? (
            props.profile.contacts.map((contact, index) => (
              <li
                key={`contact-${index}`}
                onClick={() => props.setSelectedContact(index)}>
                {contact.username}
              </li>
            ))
          ) : (
            <p>You have no contacts!</p>
          )}
        </ul>
      </div>
      {add && <AddContact setAdd={setAdd} />}
    </>
  );
}
