import { useState, useEffect } from "react";
import { fetchJson } from "../scripts/Fetch";

export function Chat(props) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [attachement, setAttachement] = useState(undefined);

  async function sendMessage(content) {
    const message = {
      content,
    };
    if (props.contactName) {
      message.contactName = props.contactName;
    } else {
      message.channelId = props.channelId;
    }
    if (attachement) {
      message.attachement = attachement;
    }
    const response = await fetchJson("/message", "POST", message);

    if (response.status < 400) {
      setContent("");
      setAttachement(undefined);
      document.querySelector("#attachement-file").value = null;
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
        (!props.contactName && message.reciever === props.channelId) ||
        (!props.channelId &&
          (message.author === props.contactName ||
            message.reciever === props.contactName))
      ) {
        setMessages((oldValue) => [...oldValue, message]);
        scrollChatToBottom();
      }
    });

    window.socket.emit("channelSet", props.channelId || "");

    async function fetchMessages() {
      const query = props.contactName
        ? `contactName=${props.contactName}`
        : `channelId=${props.channelId}`;
      const response = await fetchJson(`/message?${query}`, "GET");

      if (response.status < 400) {
        setMessages(await response.json());
        scrollChatToBottom();
      } else {
        console.log(await response.text());
      }
    }
    fetchMessages();
  }, [props.contactName, props.channelId]);

  function onFileAttachement(event) {
    const file = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onloadend = (e) => {
      setAttachement(e.target.result);
    };

    fileReader.readAsDataURL(file);
  }

  function removeAttachement(event) {
    setAttachement(undefined);
  }

  return (
    <div className="contact-chat-container">
      <div className="chat-message-container">
        {messages.map((message, index) => (
          <div key={`chat-message-${index}`} className="chat-message">
            <h3>{message.author}</h3>
            <h5>{`${message.date} - ${message.time}`}</h5>
            <p>{message.content}</p>
            {message.attachement && message.attachement.includes("video") ? (
              <video controls src={message.attachement}></video>
            ) : (
              <embed src={message.attachement} />
            )}
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          id="attachement-file"
          onChange={onFileAttachement}
          type="file"
          hidden
          multiple={false}
        />
        {attachement ? (
          <button onClick={removeAttachement}>-</button>
        ) : (
          <label htmlFor="attachement-file">➕</label>
        )}
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
