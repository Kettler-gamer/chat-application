export function AddedUsers({ addedUsers, setAddedUsers }) {
  return (
    <>
      <p>Added users: {addedUsers.length}</p>
      <ul className="added-list">
        {addedUsers.map((user, index) => (
          <li key={`addedUser-${index}`}>
            <p>{user}</p>
            <button
              className="add-btn"
              type="button"
              onClick={() =>
                setAddedUsers((oldValue) =>
                  oldValue.filter((name) => name !== user)
                )
              }>
              -
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
