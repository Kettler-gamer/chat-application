import { AddContact } from "../AddContact";
import { AddChannel } from "../AddChannel/AddChannel";
import { useState } from "react";
import { fetchJson } from "../../scripts/Fetch";
import { ContactsList } from "./ContactsList";
import { ChannelsList } from "./ChannelsList";
import { ContactHead } from "./ContactHead";
import { onNewUsers, onLeftChannel } from "../../scripts/socket";

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
    props.setSelectedContact(undefined);
    props.setSelectedChannel(undefined);
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
    window.socket.on("newChannel", (channel) =>
      props.setChannels((oldValue) => [...oldValue, channel])
    );

    window.socket.on("newUsers", (data) => onNewUsers(data, props.setChannels));

    window.socket.on("leftChannel", (data) =>
      onLeftChannel(
        data,
        props.setChannels,
        props.setSelectedChannel,
        props.setProfile
      )
    );
  }
  return (
    <>
      <div className="contacts-section">
        <ContactHead
          section={section}
          search={search}
          setSearch={setSearch}
          setAdd={setAdd}
          onSectionClick={onSectionClick}
        />
        {props.profile !== undefined && (
          <ul className="contacts-list">
            {section === "contacts" && props.profile.contacts.length > 0 ? (
              <ContactsList
                contacts={props.profile.contacts}
                search={search}
                selectedContact={props.selectedContact}
                setLoading={props.setLoading}
                setSelectedContact={props.setSelectedContact}
                setSelectedChannel={props.setSelectedChannel}
              />
            ) : (
              section === "contacts" && <p>You have no contacts!</p>
            )}
            {section === "channels" && props.profile.channelIds.length > 0 ? (
              <ChannelsList props={props} search={search} />
            ) : (
              section === "channels" && <p>You have no channels!</p>
            )}
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
