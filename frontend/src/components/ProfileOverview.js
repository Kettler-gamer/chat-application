import { useState } from "react";

export function ProfileOverview({ profile }) {
  const [cat, setCat] = useState("contacts");
  const [currentContact, setCurrentContact] = useState("");

  let list;
  switch (cat) {
    case "contacts":
      list = profile?.contacts || [];
      break;
    case "requests":
      list = profile?.requests || [];
      break;
    case "blocked":
      list = profile?.blocked || [];
      break;
    default:
      list = [];
  }

  const buttonNames = ["Contacts", "Requests", "Blocked"];

  function onCatClick(newCat) {
    setCat(newCat);
    setCurrentContact("");
  }

  function onContactOptionClick(contact) {
    if (contact === currentContact) {
      return setCurrentContact("");
    }

    setCurrentContact(contact);
  }

  function onRemoveContactClick(contact) {
    // to be implemented
    console.log(contact);
  }

  return (
    <div className="contact-page">
      <div className="contact-top">
        {buttonNames.map((btnName) => (
          <button
            key={btnName}
            className="profile-overview-btn"
            onClick={() => onCatClick(btnName.toLowerCase())}>
            {btnName}
          </button>
        ))}
      </div>
      <div className="contact-list-container">
        <ul className="contact-list">
          {list.map((contact, index) => (
            <li key={`contact-${index}`} className="list-item">
              <div
                className="profile-picture"
                style={{
                  backgroundImage: `url(${
                    contact.profilePicture || `/images/profile-pic.webp`
                  })`,
                }}></div>
              <p>{contact.username}</p>
              <div className="contact-btns">
                <button onClick={() => onContactOptionClick(contact.username)}>
                  <svg>
                    <rect y={10} x={9} height={2} rx={2} width={22} />
                    <rect y={18} x={9} height={2} rx={2} width={22} />
                    <rect y={26} x={9} height={2} rx={2} width={22} />
                  </svg>
                  <ul
                    className="option-list"
                    style={
                      contact.username === currentContact
                        ? {}
                        : { display: "none" }
                    }>
                    <li onClick={() => onRemoveContactClick(contact)}>
                      <p>Remove</p>
                    </li>
                  </ul>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
