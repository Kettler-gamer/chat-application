import { info } from "../pages/MainPage";
import { Chat } from "./Chat";

export function Contact(props) {
  async function callClick() {
    info.conn = window.peer.connect(
      props.profile.contacts[props.selectedContact].username
    );
    info.currentCall = info.peer.call(
      props.profile.contacts[props.selectedContact].username,
      window.localStream
    );
    info.currentCall.on("stream", (stream) => {
      console.log("stream");
      window.remoteAudio.srcObject = stream;
      window.remoteAudio.autoplay = true;
      window.peerStream = stream;
      props.setCaller(props.profile.contacts[props.selectedContact].username);
      window.localStream.getTracks()[0].enabled = true;
    });
    info.conn.on("close", () => {
      console.log("Close connection!");
      props.setCall(false);
      props.setCaller("");
    });
    props.setCall(true);
  }

  return (
    <div className="contact-page">
      {props.selectedContact !== undefined && props.profile && (
        <>
          <div className="contact-top">
            <p>{props.profile.contacts[props.selectedContact].username}</p>
            <div className="contact-btns">
              <button onClick={callClick}>📞</button>
            </div>
          </div>
          {props.profile.contacts[props.selectedContact].username && (
            <Chat
              contactName={
                props.profile.contacts[props.selectedContact].username
              }
            />
          )}
        </>
      )}
    </div>
  );
}
