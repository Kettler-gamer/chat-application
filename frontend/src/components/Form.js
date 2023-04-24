export function Form(props) {
  return (
    <form onSubmit={props.onSubmit}>
      <h2>{props.title}</h2>
      {props.content}
      {props.buttons}
      {props.serverMessage}
    </form>
  );
}
