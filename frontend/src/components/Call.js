import { info } from "../pages/MainPage";
import { useState } from "react";
import React from "react";

export function Call(props) {
  const [mute, setMute] = useState(false);

  function onEndCall() {
    console.log("End call");
    setMute(false);
    const track = window.localStream.getTracks()[0];

    track.enabled = false;
    info.conn.close();
    info.currentCall.close();
  }

  function onMute() {
    const track = window.localStream.getTracks()[0];

    track.enabled = !track.enabled;
    setMute((oldValue) => !oldValue);
  }

  function videoClick() {
    console.log("Video Click!");
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      info.currentVideoCall = window.peer.call(props.caller, stream, {
        metadata: { callType: "private", streamType: "video" },
      });
    });
  }

  return (
    <div className="call">
      {props.caller === "" ? (
        <p>Calling contact...</p>
      ) : (
        <>
          <p>{props.caller}</p>
          <button onClick={onEndCall}>End call</button>
          <button
            style={mute ? { backgroundColor: "red" } : {}}
            onClick={onMute}>
            Mute
          </button>
          <button onClick={videoClick}>📽️</button>
          <div className="videos"></div>
          {props.videoStreams.map((stream) => {
            const videos = document.querySelector(".videos");
            if (!videos) return;
            videos.innerHTML = "";
            const video = document.createElement("video");
            video.srcObject = stream;
            video.autoplay = true;
            videos.append(video);
          })}
        </>
      )}
    </div>
  );
}
