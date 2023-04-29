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
          username={props.profile.username}
          contactName={props.profile.contacts[props.selectedContact].username}
          setLoading={props.setLoading}
          loading={props.loading}
        />
      ) : (
        props.selectedChannel !== undefined && (
          <Chat
            username={props.profile.username}
            channelId={props.profile.channelIds[props.selectedChannel]}
            setLoading={props.setLoading}
            loading={props.loading}
          />
        )
      )}
    </div>
  );
}
