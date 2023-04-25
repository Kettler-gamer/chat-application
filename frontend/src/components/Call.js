import { info } from "../pages/MainPage";

export function Call(props) {
  function onEndCall() {
    console.log("End call");
    info.conn.close();
    info.currentCall.close();
  }

  function onMute() {
    info.mute = !info.mute;

    if (!info.mute) {
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
