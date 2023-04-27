import { useNavigate } from "react-router-dom";

export function Header(props) {
  const navigate = useNavigate();
  return (
    <header>
      {props.profile && (
        <>
          <img
            src={props.profile.profilePicture || "/images/profile-pic.webp"}
            alt="profile"
          />
          <h2>{props.profile.username}</h2>
          <button onClick={() => navigate("/main/settings")}>Settings</button>
        </>
      )}
    </header>
  );
}
