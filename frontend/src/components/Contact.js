import { info } from "../pages/MainPage";
import { useState, useEffect, useRef } from "react";
import { fetchJson } from "../scripts/Fetch";

export function Contact(props) {
  const [messages, setMessages] = useState([]);
  const ref = useRef(false);

  async function fetchMessages() {
    const response = await fetchJson(
      `/message?contactName=${
        props.profile.contacts[props.selectedContact].username
      }`,
      "GET"
    );

    if (response.status < 400) {
      setMessages(await response.json());
    } else {
      console.log(await response.text());
    }
  }

  async function callClick() {
    info.conn = window.peer.connect(
      props.profile.contacts[props.selectedContact].username
    );
    info.currentCall = info.peer.call(
      props.profile.contacts[props.selectedContact].username,
      window.localStream
    );
    info.currentCall.on("stream", (stream) => {
      console.log("stream");
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

  useEffect(() => {
    if (!ref.current) {
      ref.current = true;
      fetchMessages();
    }
  });

  return (
    <div className="contact-page">
      {props.selectedContact !== undefined && props.profile && (
        <>
          <div className="contact-top">
            <p>{props.profile.contacts[props.selectedContact].username}</p>
            <div className="contact-btns">
              <button onClick={callClick}>📞</button>
            </div>
          </div>
          <div className="contact-chat-container">
            <div className="chat-message-container">
              {messages.map((message) => (
                <p>{message.content}</p>
              ))}
            </div>
            <div className="chat-input-container">
              <button>➕</button>
              <input placeholder="Type here..." />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
