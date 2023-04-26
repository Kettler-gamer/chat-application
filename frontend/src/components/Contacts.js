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
                className="list-item"
                key={`contact-${index}`}
                onClick={() => props.setSelectedContact(index)}>
                <img
                  src={contact.profilePicture || `/images/profile-pic.webp`}
                  alt="profile"
                />
                <p>{contact.username}</p>
              </li>
            ))
          ) : (
            <p>You have no contacts!</p>
          )}
        </ul>
      </div>
      {add && <AddContact setAdd={setAdd} setProfile={props.setProfile} />}
    </>
  );
}
