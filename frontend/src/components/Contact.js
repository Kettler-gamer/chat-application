export function Contact(props) {
  function callClick() {
    props.socket.emit(
      "call",
      props.profile.contacts[props.selectedContact].username
    );
  }

  return (
    <div className="contact-page">
      {props.selectedContact !== undefined && props.profile && (
        <>
          <p>{props.profile.contacts[props.selectedContact].username}</p>
          <button onClick={callClick}>Call</button>
        </>
      )}
    </div>
  );
}
