import { Chat } from "./Chat";
import { Contact } from "./Contact";

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
      {props.profile &&
        props.selectedContact !== undefined &&
        props.profile.contacts[props.selectedContact].username && (
          <Chat
            contactName={props.profile.contacts[props.selectedContact].username}
          />
        )}
    </div>
  );
}
