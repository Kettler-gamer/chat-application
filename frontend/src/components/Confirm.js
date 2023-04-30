export function Confirm(props) {
  function onBlackClick(event) {
    if (event.target.className === "black-background") props.onCancel();
  }

  return (
    <div className="black-background" onClick={onBlackClick}>
      <div className="confirm-page">
        <h3>{props.title}</h3>
        <div>
          <button onClick={props.onConfirm}>Yes</button>
          <button onClick={props.onCancel}>No</button>
        </div>
      </div>
    </div>
  );
}
