export function Header(props) {
  return (
    <header>
      {props.profile && (
        <>
          <h2>{props.profile.username}</h2>
        </>
      )}
    </header>
  );
}
