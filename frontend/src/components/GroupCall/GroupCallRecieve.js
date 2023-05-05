export function GroupCallRecieve({ users, onAnswer, onDecline }) {
  return (
    <>
      {users.map((user) => (
        <p key={`recieving-${user.username}`}>{user.username}</p>
      ))}
      <audio
        src={"/sounds/plain_stupid.mp3"}
        autoPlay
        onEnded={(event) => event.target.play()}></audio>
      <button onClick={onAnswer}>Answer</button>
      <button onClick={onDecline}>Decline</button>
    </>
  );
}
