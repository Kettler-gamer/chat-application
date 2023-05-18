export function ProfileOverview({ profile }) {
  console.log(profile);
  return (
    <div className="contact-page">
      <div className="contact-top">
        <button className="profile-overview-btn">Contacts</button>
        <button className="profile-overview-btn">Requests</button>
        <button className="profile-overview-btn">Blocked</button>
      </div>
      <div className="contact-list-container">
        <ul className="contact-list">
          {profile?.contacts.map((contact, index) => (
            <li key={`contact-${index}`} className="list-item">
              <div
                className="profile-picture"
                style={{
                  backgroundImage: `url(${
                    contact.profilePicture || `/images/profile-pic.webp`
                  })`,
                }}></div>
              <p>{contact.username}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
