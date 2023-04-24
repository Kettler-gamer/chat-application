export function Contact(props) {
  return (
    <div className="contact-page">
      {props.selectedContact !== undefined && props.profile && (
        <>
          <p>{props.profile.contacts[props.selectedContact].username}</p>
          <button>Call</button>
        </>
      )}
    </div>
  );
}
