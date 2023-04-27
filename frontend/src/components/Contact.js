import { info } from "../pages/MainPage";
import { onStream } from "../scripts/peer";

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
      onStream(stream);
      props.setCaller(props.profile.contacts[props.selectedContact].username);
    });
    info.conn.on("close", () => {
      console.log("Close connection!");
      props.setCall(false);
      props.setCaller("");
    });
    props.setCall(true);
  }

  return (
    <div className="contact-top">
      <p>{props.profile.contacts[props.selectedContact].username}</p>
      <div className="contact-btns">
        <button onClick={callClick}>📞</button>
      </div>
    </div>
  );
}
