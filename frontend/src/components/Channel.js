export function Channel(props) {
  return (
    <div className="contact-top">
      <p>{props.name || `Channel ${props.channelNumber}`}</p>
      <div className="contact-btns">{/* <button>📞</button> */}</div>
    </div>
  );
}
