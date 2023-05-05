export function MessageContainer({ messages, props }) {
  return (
    <div className="chat-message-container">
      {messages.map((message, index) => (
        <div
          key={`chat-message-${index}`}
          className={
            message.author === props.username
              ? "chat-message my-message"
              : "chat-message"
          }>
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
  );
}
