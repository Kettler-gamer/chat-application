import { Chat } from "./Chat";
import { Contact } from "./Contact";
import { Channel } from "./Channel/Channel";

export function ChatSection(props) {
  return (
    <div className="contact-page">
      {props.selectedContact !== undefined && props.profile && (
        <Contact
          profile={props.profile}
          selectedContact={props.selectedContact}
          setCall={props.setCall}
          setCaller={props.setCaller}
          setVideoStreams={props.setVideoStreams}
        />
      )}
      {props.selectedChannel !== undefined && props.profile && (
        <Channel
          name={props.channels[props.selectedChannel].name}
          channelId={props.profile.channelIds[props.selectedChannel]}
          channelNumber={props.selectedChannel + 1}
          profile={props.profile}
          setProfile={props.setProfile}
          setSelectedChannel={props.setSelectedChannel}
          channels={props.channels}
          setChannels={props.setChannels}
          setGroupCall={props.setGroupCall}
          setCurrentGroup={props.setCurrentGroup}
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
