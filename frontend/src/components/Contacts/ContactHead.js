export function ContactHead({
  section,
  search,
  setSearch,
  setAdd,
  onSectionClick,
}) {
  return (
    <div className="contact-nav">
      <input
        placeholder={
          section === "contacts" ? "search contact.." : "search channel..."
        }
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button className="add-btn" onClick={() => setAdd(true)}>
        +
      </button>
      <div className="section-switch">
        <button name="channels" onClick={onSectionClick}>
          Channels
        </button>
        <button name="contacts" onClick={onSectionClick}>
          Contacts
        </button>
        <div
          className="green-slide"
          style={
            section === "channels"
              ? { transform: "translateX(0)" }
              : { transform: "translateX(100%)" }
          }></div>
      </div>
    </div>
  );
}
