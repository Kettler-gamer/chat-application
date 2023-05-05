import info from "../scripts/userinfo";
import { onPrivateCallAnswer } from "../scripts/peer";

export function Calling(props) {
  function onAnswer() {
    onPrivateCallAnswer(props);
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
