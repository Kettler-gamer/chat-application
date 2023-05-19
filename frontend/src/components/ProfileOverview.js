import { useState } from "react";
import { fetchJson } from "../scripts/Fetch";

export function ProfileOverview({ profile, setProfile }) {
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

  async function onRemoveContactClick(contactId) {
    const response = await fetchJson("/removeContact", "DELETE", {
      contactId,
    });

    if (response.status < 400) {
      setProfile((oldValue) => {
        const newValue = JSON.parse(JSON.stringify(oldValue));

        newValue.contacts = newValue.contacts.filter(
          (element) => element._id !== contactId
        );

        return newValue;
      });
    }
  }

  async function onAcceptRequest(contact) {
    const response = await fetchJson("/user", "PUT", {
      contactName: contact.username,
    });

    if (response.status < 400) {
      setProfile((oldValue) => {
        const newValue = JSON.parse(JSON.stringify(oldValue));

        newValue.requests = newValue.requests.filter(
          (req) => req.username !== contact.username
        );

        newValue.contacts = [...newValue.contacts, contact];

        return newValue;
      });
    } else {
      console.log(await response.text());
    }
  }

  async function onDeclineRequest() {
    //
  }

  return (
    <div className="contact-page">
      <div className="contact-top">
        {buttonNames.map((btnName) => (
          <button
            key={btnName}
            className="profile-overview-btn"
            onClick={() => onCatClick(btnName.toLowerCase())}>
            {`${btnName}${
              btnName === "Requests"
                ? ` (${profile?.requests?.length || 0})`
                : ""
            }`}
          </button>
        ))}
        <div
          className="slider"
          style={{
            marginLeft: `${
              cat === "contacts" ? "-66%" : cat === "requests" ? "0%" : "66%"
            }`,
          }}></div>
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
                    {cat === "contacts" ? (
                      <>
                        <li onClick={() => onRemoveContactClick(contact._id)}>
                          <p>Remove</p>
                        </li>
                      </>
                    ) : cat === "requests" ? (
                      <>
                        <li onClick={() => onAcceptRequest(contact)}>
                          <p>Accept</p>
                        </li>
                        <li onClick={() => onDeclineRequest(contact.username)}>
                          <p>Decline</p>
                        </li>
                      </>
                    ) : (
                      <></>
                    )}
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
