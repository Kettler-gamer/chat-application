import info from "../scripts/userinfo";
import { onStream } from "../scripts/peer";

export function Calling(props) {
  function onAnswer() {
    info.currentCall.answer(window.localStream);
    info.currentCall.on("stream", onStream);
    info.currentCall.on("track", () => {
      console.log("Track");
    });
    info.currentCall.on("close", () => {
      console.log("Call close");
      props.setCall(false);
      props.setCaller("");
      props.setVideoStreams([]);
      info.localVideoStream = undefined;
      info.currentVideoStream = undefined;
      info.currentCall = undefined;
      window.localStream.getTracks()[0].enabled = true;
    });
    props.setCall(true);
  }

  function onDecline() {
    info.currentCall.close();
    props.setCaller("");
    info.conn.close();
    info.currentCall = undefined;
  }

  return (
    <div className="called">
      <h3>{props.caller} is calling</h3>
      <button onClick={onAnswer}>Answer</button>
      <button onClick={onDecline}>Decline</button>
      <audio
        src={"/sounds/plain_stupid.mp3"}
        autoPlay
        onEnded={(event) => event.target.play()}></audio>
    </div>
  );
}
