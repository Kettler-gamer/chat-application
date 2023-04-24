export function Contacts(props) {
  return (
    <div className="contacts-section">
      <div className="contact-nav">
        <input placeholder="search.." />
        <button>+</button>
      </div>
      <ul className="contacts-list">
        {props.profile !== undefined && props.profile.contacts.length > 0 ? (
          props.profile.contacts.map((contact, index) => (
            <li onClick={() => props.setSelectedContact(index)}>
              {contact.username}
            </li>
          ))
        ) : (
          <p>You have no contacts!</p>
        )}
      </ul>
    </div>
  );
}
