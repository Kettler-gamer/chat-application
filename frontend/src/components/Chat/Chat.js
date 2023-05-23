import { useState, useEffect } from "react";
import { fetchJson } from "../../scripts/Fetch";
import { LoadingMessages } from "../LoadingMessages";
import { MessageContainer } from "./MessageContainer";
import { ChatInputContainer } from "./ChatInputContainer";
import info from "../../scripts/userinfo";

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
      cont?.scrollTo(0, cont.scrollHeight);
    }, 1);
  }

  useEffect(() => {
    if (window.socket._callbacks.$newMessage.length > 1) {
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

    info.currentChat = props.channelId || props.contactName;

    async function fetchMessages() {
      const query = props.contactName
        ? `contactName=${props.contactName}`
        : `channelId=${props.channelId}`;
      const response = await fetchJson(`/message?${query}`, "GET");

      if (response.status < 400) {
        setMessages(await response.json());
        scrollChatToBottom();
        props.setLoading(false);
      } else {
        console.log(await response.text());
      }
    }
    fetchMessages();
  }, [props.contactName, props.channelId, props]);

  function onFileAttachement(event) {
    const file = event.target.files[0];
    const fileReader = new FileReader();

    fileReader.onloadend = (e) => {
      setAttachement(e.target.result);
    };

    fileReader.readAsDataURL(file);
  }

  function removeAttachement() {
    setAttachement(undefined);
    document.querySelector("#attachement-file").value = null;
  }

  return props.loading ? (
    <LoadingMessages />
  ) : (
    <div className="contact-chat-container">
      <MessageContainer messages={messages} props={props} />
      <ChatInputContainer
        attachement={attachement}
        content={content}
        onFileAttachement={onFileAttachement}
        removeAttachement={removeAttachement}
        handleChange={handleChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
