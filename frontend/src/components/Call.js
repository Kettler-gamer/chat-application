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
    info.currentCall.close();
    info.conn.close();
  }

  function onMute() {
    const track = window.localStream.getTracks()[0];

    track.enabled = !track.enabled;
    setMute((oldValue) => !oldValue);
  }

  function videoClick() {
    if (info.localVideoStream) {
      const videoTrack = info.localVideoStream.getTracks()[0];

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
          metadata: { callType: "private", streamType: "video" },
        });
        props.setVideoStreams((oldValue) => [...oldValue, stream]);
      });
    }
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
          <div className="videos">
            {props.videoStreams.map((stream, index) => {
              const track = stream.getVideoTracks()[0];
              track.onmute = () => {
                props.setVideoStreams((oldValue) =>
                  oldValue.filter((video) => video !== stream)
                );
              };
              return (
                <video
                  key={`video-${index}`}
                  autoPlay
                  ref={(ref) => {
                    if (ref) {
                      ref.srcObject = stream;
                    }
                  }}></video>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
