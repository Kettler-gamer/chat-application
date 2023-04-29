import { Chat } from "./Chat";
import { Contact } from "./Contact";
import { Channel } from "./Channel";

export function ChatSection(props) {
  return (
    <div className="contact-page">
      {props.selectedContact !== undefined && props.profile && (
        <Contact
          profile={props.profile}
          selectedContact={props.selectedContact}
          setCall={props.setCall}
          setCaller={props.setCaller}
        />
      )}
      {props.selectedChannel !== undefined && props.profile && (
        <Channel
          name={props.channels[props.selectedChannel].name}
          channelNumber={props.selectedChannel + 1}
        />
      )}
      {props.profile && props.selectedContact !== undefined ? (
        <Chat
          contactName={props.profile.contacts[props.selectedContact].username}
        />
      ) : (
        props.selectedChannel !== undefined && (
          <Chat channelId={props.profile.channelIds[props.selectedChannel]} />
        )
      )}
    </div>
  );
}
