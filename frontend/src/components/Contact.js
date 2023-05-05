import info from "../scripts/userinfo";
import { onStream } from "../scripts/peer";

export function Contact(props) {
  async function callClick() {
    info.conn = window.peer.connect(
      props.profile.contacts[props.selectedContact].username
    );
    info.conn.on("close", () => {
      console.log("Close connection!");
      console.log(info.conn);
      window.peer._connections.clear();
      props.setVideoStreams([]);
      props.setCall(false);
      props.setCaller("");
      info.conn = undefined;
      info.currentCall = undefined;
      console.log(info);
    });
    info.currentCall = info.peer.call(
      props.profile.contacts[props.selectedContact].username,
      window.localStream,
      { metadata: { callType: "private" } }
    );
    info.currentCall.on("stream", (stream) => {
      onStream(stream);
      props.setCaller(props.profile.contacts[props.selectedContact].username);
    });
    info.currentCall.on("close", () => {
      console.log("Call close!");
      info.currentVideoStream = undefined;
      info.localVideoStream = undefined;
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
