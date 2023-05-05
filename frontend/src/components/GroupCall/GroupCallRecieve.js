export function GroupCallRecieve({ users, onAnswer, onDecline }) {
  return (
    <>
      {users.map((user) => (
        <p key={`recieving-${user.username}`}>{user.username}</p>
      ))}
      <button onClick={onAnswer}>Answer</button>
      <button onClick={onDecline}>Decline</button>
    </>
  );
}
