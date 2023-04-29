import { AddContact } from "./AddContact";
import { useState } from "react";
import { fetchJson } from "../scripts/Fetch";

export function Contacts(props) {
  const [section, setSection] = useState("contacts");
  const [channels, setChannels] = useState([]);
  const [add, setAdd] = useState(false);

  function onSectionClick(event) {
    setSection(event.target.name);
    if (
      event.target.name === "channels" &&
      channels.length === 0 &&
      props.profile.channelIds.length > 0
    ) {
      getChannelInfo();
    }
  }

  async function getChannelInfo() {
    const responses = await Promise.all(
      props.profile.channelIds.map((channelId) => {
        return fetchJson(`/channel?channelId=${channelId}`, "GET");
      })
    );

    const data = await Promise.all(responses.map((resp) => resp.json()));

    setChannels(data);
  }
  return (
    <>
      <div className="contacts-section">
        <div className="contact-nav">
          <input placeholder="search contact.." />
          <button className="add-btn" onClick={() => setAdd(true)}>
            ➕
          </button>
          <div className="section-switch">
            <button name="channels" onClick={onSectionClick}>
              Channels
            </button>
            <button name="contacts" onClick={onSectionClick}>
              Contacts
            </button>
            <div
              className="green-slide"
              style={
                section === "channels"
                  ? { transform: "translateX(0)" }
                  : { transform: "translateX(100%)" }
              }></div>
          </div>
        </div>
        {props.profile !== undefined && (
          <ul className="contacts-list">
            {section === "contacts" && props.profile.contacts.length > 0
              ? props.profile.contacts.map((contact, index) => (
                  <li
                    className="list-item"
                    key={`contact-${index}`}
                    onClick={() => {
                      props.setSelectedContact(index);
                      props.setSelectedChannel(undefined);
                    }}>
                    <img
                      src={contact.profilePicture || `/images/profile-pic.webp`}
                      alt="profile"
                    />
                    <p>{contact.username}</p>
                  </li>
                ))
              : section === "contacts" && <p>You have no contacts!</p>}
            {section === "channels" && props.profile.channelIds.length > 0
              ? channels.map((channel, index) => (
                  <li
                    className="list-item"
                    key={`channel-${index}`}
                    onClick={() => {
                      props.setSelectedChannel(index);
                      props.setSelectedContact(undefined);
                    }}>
                    <p>
                      {channel.name ? channel.name : `Channel ${index + 1}`}
                    </p>
                  </li>
                ))
              : section === "channels" && <p>You have no channels!</p>}
          </ul>
        )}
      </div>
      {add && <AddContact setAdd={setAdd} setProfile={props.setProfile} />}
    </>
  );
}
