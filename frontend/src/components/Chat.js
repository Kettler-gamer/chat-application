import { useState, useEffect } from "react";
import { fetchJson } from "../scripts/Fetch";

export function Chat(props) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");

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
    if (event.code.includes("Enter") && content.length > 0) {
      sendMessage(content);
    }
  }

  function handleChange(event) {
    setContent(event.target.value);
  }

  function scrollChatToBottom() {
    setTimeout(() => {
      const cont = document.querySelector(".chat-message-container");
      cont.scrollTo(0, cont.scrollHeight);
    }, 200);
  }

  useEffect(() => {
    if (window.socket._callbacks.$newMessage) {
      window.socket._callbacks.$newMessage.pop();
    }
    window.socket.on("newMessage", (message) => {
      if (
        message.author === props.contactName ||
        message.reciever === props.contactName
      ) {
        setMessages((oldValue) => [...oldValue, message]);
        scrollChatToBottom();
      }
    });
    async function fetchMessages() {
      const response = await fetchJson(
        `/message?contactName=${props.contactName}`,
        "GET"
      );

      if (response.status < 400) {
        setMessages(await response.json());
        scrollChatToBottom();
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
