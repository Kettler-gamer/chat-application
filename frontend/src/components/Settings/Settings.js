import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { Profile } from "./ProfileRoutes/Profile";
import { Account } from "./Account";

export function Settings(props) {
  const navigate = useNavigate();

  function onBlackClick(event) {
    if (event.target.className === "black-background") {
      navigate("/main");
    }
  }

  function onNavigate(path) {
    navigate(`/main/settings${path}`);
  }

  return (
    <div className="black-background" onClick={onBlackClick}>
      <div className="settings-page">
        <button className="close-btn" onClick={() => navigate("/main")}>
          X
        </button>
        <div className="side-bar">
          <button onClick={() => onNavigate("/profile")}>Profile</button>
          <button onClick={() => onNavigate("/account")}>Account</button>
        </div>
        <div className="option-settings">
          <Routes>
            <Route
              path="profile/*"
              element={
                <Profile
                  profile={props.profile}
                  setProfile={props.setProfile}
                />
              }
            />
            <Route
              path="account/*"
              element={
                <Account
                  profile={props.profile}
                  setProfile={props.setProfile}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}
