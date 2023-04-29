export function Form(props) {
  return (
    <form className={props.className || ""} onSubmit={props.onSubmit}>
      <h2>{props.title}</h2>
      {props.content}
      {props.buttons}
      {props.serverMessage}
    </form>
  );
}
