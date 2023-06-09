export function ContactsList({
  contacts,
  search,
  selectedContact,
  setLoading,
  setSelectedContact,
  setSelectedChannel,
}) {
  return contacts
    .filter((contact) =>
      contact.username.toLowerCase().startsWith(search.toLowerCase())
    )
    .map((contact, index) => (
      <li
        className={
          selectedContact === contacts.indexOf(contact)
            ? "list-item selected"
            : "list-item"
        }
        key={`contact-${index}`}
        onClick={() => {
          setLoading(true);
          setSelectedContact(contacts.indexOf(contact));
          setSelectedChannel(undefined);
        }}>
        <div
          className="contact-picture"
          style={{
            backgroundImage: `url(${
              contact.profilePicture || `/images/profile-pic.webp`
            })`,
          }}></div>
        <div
          className="status"
          style={{
            backgroundColor: contact.online ? "green" : "grey",
          }}></div>
        <p>{contact.username}</p>
      </li>
    ));
}
