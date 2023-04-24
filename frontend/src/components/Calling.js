export function Calling(props) {
  function onAnswer() {
    props.socket.emit("answer", true);
  }

  function onDecline() {
    props.socket.emit("answer", false);
    props.setCaller("");
  }

  return (
    <div className="black-background">
      <div className="called">
        <h3>{props.caller} is calling</h3>
        <button onClick={onAnswer}>Answer</button>
        <button onClick={onDecline}>Decline</button>
        <audio
          src={"/sounds/plain_stupid.mp3"}
          autoPlay
          onEnded={(event) => event.target.play()}></audio>
      </div>
    </div>
  );
}
