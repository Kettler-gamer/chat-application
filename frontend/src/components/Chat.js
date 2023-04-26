import { useState, useEffect } from "react";
import { fetchJson } from "../scripts/Fetch";

export function Chat(props) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchMessages() {
      const response = await fetchJson(
        `/message?contactName=${props.contactName}`,
        "GET"
      );

      if (response.status < 400) {
        setMessages(await response.json());
      } else {
        console.log(await response.text());
      }
    }
    fetchMessages();
  }, [props.contactName]);

  return (
    <div className="contact-chat-container">
      <div className="chat-message-container">
        {messages.map((message, index) => (
          <div key={`chat-message-${index}`} className="chat-message">
            <h3>{message.author}</h3>
            <h5>{`${message.date} - ${message.time}`}</h5>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <button>➕</button>
        <input placeholder="Type here..." />
      </div>
    </div>
  );
}
