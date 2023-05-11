import info from "../scripts/userinfo";
import { useState } from "react";
import React from "react";

export function Call(props) {
  const [mute, setMute] = useState(false);
  const [max, setMax] = useState(false);

  function onEndCall() {
    console.log("End call");
    setMute(false);
    const track = window.localStream.getTracks()[0];

    track.enabled = false;
    info.currentCall.close();
    info.conn.close();
    window.peer._connections.clear();
    info.currentCall = undefined;
    info.conn = undefined;
    console.log(info);
  }

  function onMute() {
    const track = window.localStream.getTracks()[0];

    track.enabled = !track.enabled;
    setMute((oldValue) => !oldValue);
  }

  function videoClick() {
    if (info.localVideoStream) {
      const videoTrack = info.localVideoStream.getTracks()[0];
      info.conn.send(`Stopped ${window.peer._id}-webcam`);
      videoTrack.stop();
      props.setVideoStreams((oldValue) =>
        oldValue.filter((video) => {
          const track = video.getVideoTracks()[0];
          return track.readyState !== "ended";
        })
      );
      info.localVideoStream = undefined;
    } else {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        info.localVideoStream = stream;
        info.currentVideoCall = window.peer.call(props.caller, stream, {
          metadata: {
            callType: "private",
            streamType: "video",
            videoId: `${window.peer._id}-webcam`,
          },
        });
        props.setVideoStreams((oldValue) => [...oldValue, stream]);
      });
    }
  }

  function onScreenClick() {
    console.log("Screen click");
    if (info.localScreenStream) {
      const screenTrack = info.localScreenStream.getTracks()[0];
      info.conn.send(`Stopped ${window.peer._id}-screen`);
      screenTrack.stop();
      props.setVideoStreams((oldValue) =>
        oldValue.filter((video) => {
          const track = video.getVideoTracks()[0];
          return track.readyState !== "ended";
        })
      );
      info.localScreenStream = undefined;
    } else {
      navigator.mediaDevices.getDisplayMedia({}).then((stream) => {
        info.localScreenStream = stream;
        info.currentScreenCall = window.peer.call(props.caller, stream, {
          metadata: {
            callType: "private",
            streamType: "video",
            videoId: `${window.peer._id}-screen`,
          },
        });
        props.setVideoStreams((oldValue) => [...oldValue, stream]);
      });
    }
  }

  function onIncrease() {
    setMax((oldValue) => !oldValue);
  }

  return (
    <div className={max ? "call call-max" : "call"}>
      {props.caller === "" ? (
        <p>Calling contact...</p>
      ) : (
        <>
          <p>{props.caller}</p>
          <button className="increase-btn" onClick={onIncrease}>
            🔍
          </button>
          <button onClick={onEndCall}>End call</button>
          <button
            style={mute ? { backgroundColor: "red" } : {}}
            onClick={onMute}>
            Mute
          </button>
          <button onClick={videoClick}>📽️</button>
          <button onClick={onScreenClick}>🖥️</button>
          <div className="videos">
            {props.videoStreams.map((stream, index) => (
              <video
                key={`video-${index}`}
                autoPlay
                ref={(ref) => {
                  if (ref) {
                    ref.srcObject = stream;
                  }
                }}></video>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
