import { info } from "../pages/MainPage";

export function Contact(props) {
  async function callClick() {
    if (!props.socket) {
      await props.setupSocket();
    }
    info.conn = info.peer.connect(
      props.profile.contacts[props.selectedContact].username
    );
    info.currentCall = info.peer.call(
      props.profile.contacts[props.selectedContact].username,
      window.localStream
    );
    info.currentCall.on("stream", (stream) => {
      console.log("Stream click");
      window.remoteAudio.srcObject = stream;
      window.remoteAudio.autoplay = true;
      window.peerStream = stream;
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
    <div className="contact-page">
      {props.selectedContact !== undefined && props.profile && (
        <>
          <p>{props.profile.contacts[props.selectedContact].username}</p>
          <button onClick={callClick}>Call</button>
        </>
      )}
    </div>
  );
}
