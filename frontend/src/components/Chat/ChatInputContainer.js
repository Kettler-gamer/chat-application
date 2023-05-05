export function ChatInputContainer({
  attachement,
  content,
  onFileAttachement,
  removeAttachement,
  handleChange,
  onKeyDown,
}) {
  return (
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
        <label htmlFor="attachement-file">+</label>
      )}
      <input
        placeholder="Type here..."
        value={content}
        onChange={handleChange}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
