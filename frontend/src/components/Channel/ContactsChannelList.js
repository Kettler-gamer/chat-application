export function ContactsChannelList({
  profile,
  currentUsers,
  addedUsers,
  setAddedUsers,
}) {
  return (
    <>
      <p>Contacts</p>
      <ul className="channel-add-contact-list">
        {profile.contacts
          .filter((contact) => !currentUsers.includes(contact.username))
          .filter((contact) => !addedUsers.includes(contact.username))
          .map((contact, index) => (
            <li key={`addUser-${index}`}>
              <p>{contact.username}</p>
              <button
                className="add-btn"
                type="button"
                onClick={() =>
                  setAddedUsers((oldValue) => [...oldValue, contact.username])
                }>
                +
              </button>
            </li>
          ))}
      </ul>
    </>
  );
}
