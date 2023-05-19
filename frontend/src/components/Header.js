import { useNavigate } from "react-router-dom";

export function Header(props) {
  const navigate = useNavigate();
  return (
    <header>
      {props.profile && (
        <>
          <div
            className="profile-picture"
            style={{
              backgroundImage: `url(${
                props.profile.profilePicture || "/images/profile-pic.webp"
              })`,
            }}></div>

          <h2>{props.profile.username}</h2>
          <button onClick={() => navigate("/main/settings")}>Settings</button>
        </>
      )}
    </header>
  );
}
