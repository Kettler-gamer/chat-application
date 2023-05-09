import { Routes, Route, useNavigate } from "react-router-dom";
import { ChangePassword } from "./AccountRoutes/ChangePassword";

export function Account(props) {
  const navigate = useNavigate();

  function onLogout() {
    sessionStorage.removeItem("jwtToken");
    navigate("/");
  }

  return (
    <>
      <button
        className="option-btn"
        onClick={() => navigate("/main/settings/account/changepassword")}>
        Change password
      </button>
      <button className="option-btn" onClick={onLogout}>
        Logout
      </button>
      <Routes>
        <Route path="changepassword" element={<ChangePassword />} />
      </Routes>
    </>
  );
}
