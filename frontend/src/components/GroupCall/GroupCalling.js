export function GroupCalling({ users, username, onMute, mute, endCall }) {
  return (
    <>
      {users.map((user) => (
        <p
          key={`group-chat-names-${user.username}`}
          style={
            !user.answered && username !== user.username
              ? { color: "grey" }
              : {}
          }>
          {user.username}
          {username !== user.username &&
            (user.answered ? " On Call" : " Calling...")}
        </p>
      ))}
      <button onClick={onMute} style={mute ? { backgroundColor: "red" } : {}}>
        Mute
      </button>
      <button onClick={endCall}>End call</button>
    </>
  );
}
