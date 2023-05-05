export function ContactsList({ addedUsers, setAddedUsers, props }) {
  return (
    <>
      <p>Contacts</p>
      <ul className="channel-add-contact-list">
        {props.profile.contacts
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
