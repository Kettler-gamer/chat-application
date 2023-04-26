import { useState, useEffect, useRef } from "react";
import { fetchJson } from "../scripts/Fetch";

export function Chat(props) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const ref = useRef(false);

  async function sendMessage(content) {
    const response = await fetchJson("/message", "POST", {
      contactName: props.contactName,
      content,
    });

    if (response.status < 400) {
      setContent("");
    } else {
      console.log(await response.text());
    }
  }

  function onKeyDown(event) {
    if (event.code === "Enter" && content.length > 0) {
      sendMessage(content);
    }
  }

  function handleChange(event) {
    setContent(event.target.value);
  }

  useEffect(() => {
    if (!ref.current) {
      ref.current = true;
      window.socket.on("newMessage", (message) => {
        setMessages((oldValue) => [...oldValue, message]);
      });
    }
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
        <input
          placeholder="Type here..."
          value={content}
          onChange={handleChange}
          onKeyDown={onKeyDown}
        />
      </div>
    </div>
  );
}
