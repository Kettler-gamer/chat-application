import { info } from "../pages/MainPage";
import { useState } from "react";

export function Call(props) {
  const [mute, setMute] = useState(false);

  function onEndCall() {
    console.log("End call");
    info.conn.close();
    info.currentCall.close();
  }

  function onMute() {
    const track = window.localStream.getTracks()[0];

    track.enabled = !track.enabled;
    setMute((oldValue) => !oldValue);
  }

  return (
    <div className="black-background">
      <div className="call">
        <p>{props.caller}</p>
        <button onClick={onEndCall}>End call</button>
        <button style={mute ? { backgroundColor: "red" } : {}} onClick={onMute}>
          Mute
        </button>
      </div>
    </div>
  );
}
