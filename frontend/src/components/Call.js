import { info } from "../pages/MainPage";
import { onStartCall } from "../scripts/startCall";

export function Call(props) {
  function onEndCall() {
    props.setCaller("");
    props.setCall(false);
    info.mute = true;
    info.socket.emit("endCall");
    setTimeout(() => {
      info.mute = false;
    }, 1000);
  }

  function onMute() {
    info.mute = !info.mute;

    if (!info.mute) {
      onStartCall(props.socket);
    }
  }

  return (
    <div className="black-background">
      <div className="call">
        <p>{props.caller}</p>
        <button onClick={onEndCall}>End call</button>
        <button onClick={onMute}>Mute</button>
      </div>
    </div>
  );
}
