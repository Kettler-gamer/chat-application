import { AddContact } from "./AddContact";
import { AddChannel } from "./AddChannel";
import { useState } from "react";
import { fetchJson } from "../scripts/Fetch";
import info from "../scripts/userinfo";

export function Contacts(props) {
  const [search, setSearch] = useState("");
  const [section, setSection] = useState("contacts");
  const [add, setAdd] = useState(false);

  function onSectionClick(event) {
    setSection(event.target.name);
    if (
      event.target.name === "channels" &&
      props.channels.length === 0 &&
      props.profile.channelIds.length > 0
    ) {
      getChannelInfo();
    }
    setSearch("");
  }

  async function getChannelInfo() {
    const responses = await Promise.all(
      props.profile.channelIds.map((channelId) => {
        return fetchJson(`/channel?channelId=${channelId}`, "GET");
      })
    );

    const data = await Promise.all(
      responses.map(async (resp, index) => {
        return {
          ...(await resp.json()),
          _id: props.profile.channelIds[index],
        };
      })
    );

    props.setChannels(data);
    window.socket.on("newChannel", (channel) => {
      props.setChannels((oldValue) => [...oldValue, channel]);
    });
    window.socket.on("newUsers", (data) => {
      props.setChannels((oldValue) => {
        const newValue = JSON.parse(JSON.stringify(oldValue));

        newValue
          .find((channel) => channel._id === data.channelId)
          .users.push(...data.users);

        return newValue;
      });
    });
    window.socket.on("leftChannel", (data) => {
      props.setChannels((oldValue) => {
        if (info.username === data.username) {
          return oldValue.filter((channel) => channel._id !== data.channelId);
        } else {
          const newValue = JSON.parse(JSON.stringify(oldValue));
          const users = newValue.find(
            (channel) => channel._id === data.channelId
          ).users;

          users.splice(users.indexOf(data.username), 1);

          return newValue;
        }
      });
      if (data.username === info.username) {
        props.setSelectedChannel(undefined);
        props.setProfile((oldValue) => {
          const newValue = JSON.parse(JSON.stringify(oldValue));

          const channelIds = newValue.channelIds;

          const index = channelIds.indexOf(data.channelId);

          channelIds.splice(index, 1);

          return newValue;
        });
      }
    });
  }
  return (
    <>
      <div className="contacts-section">
        <div className="contact-nav">
          <input
            placeholder={
              section === "contacts" ? "search contact.." : "search channel..."
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="add-btn" onClick={() => setAdd(true)}>
            +
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
              ? props.profile.contacts
                  .filter((contact) =>
                    contact.username
                      .toLowerCase()
                      .startsWith(search.toLowerCase())
                  )
                  .map((contact, index) => (
                    <li
                      className={
                        props.selectedContact === index
                          ? "list-item selected"
                          : "list-item"
                      }
                      key={`contact-${index}`}
                      onClick={() => {
                        props.setLoading(true);
                        props.setSelectedContact(index);
                        props.setSelectedChannel(undefined);
                      }}>
                      <img
                        src={
                          contact.profilePicture || `/images/profile-pic.webp`
                        }
                        alt="profile"
                      />
                      <div
                        className="status"
                        style={{
                          backgroundColor: contact.online ? "green" : "grey",
                        }}></div>
                      <p>{contact.username}</p>
                    </li>
                  ))
              : section === "contacts" && <p>You have no contacts!</p>}
            {section === "channels" && props.profile.channelIds.length > 0
              ? props.channels
                  .filter((channel, index) =>
                    channel.name
                      ? channel.name
                          .toLowerCase()
                          .startsWith(search.toLowerCase())
                      : `channel ${index + 1}`.startsWith(search.toLowerCase())
                  )
                  .map((channel, index) => (
                    <li
                      className={
                        props.selectedChannel ===
                        props.channels.indexOf(channel)
                          ? "list-item selected"
                          : "list-item"
                      }
                      style={{ padding: "1em 0" }}
                      key={`channel-${index}`}
                      onClick={() => {
                        props.setLoading(true);
                        props.setSelectedChannel(
                          props.channels.indexOf(channel)
                        );
                        props.setSelectedContact(undefined);
                      }}>
                      <p>
                        {channel.name
                          ? channel.name
                          : `Channel ${props.channels.indexOf(channel) + 1}`}
                      </p>
                    </li>
                  ))
              : section === "channels" && <p>You have no channels!</p>}
          </ul>
        )}
      </div>
      {add && section === "contacts" ? (
        <AddContact
          setAdd={setAdd}
          setProfile={props.setProfile}
          section={section}
        />
      ) : (
        add && (
          <AddChannel
            setAdd={setAdd}
            setProfile={props.setProfile}
            section={section}
            profile={props.profile}
            setChannels={props.setChannels}
          />
        )
      )}
    </>
  );
}
