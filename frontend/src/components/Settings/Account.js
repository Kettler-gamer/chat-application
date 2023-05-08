import { Routes, Route, useNavigate } from "react-router-dom";
import { ChangePassword } from "./AccountRoutes/ChangePassword";

export function Account(props) {
  const navigate = useNavigate();

  return (
    <>
      <button
        className="option-btn"
        onClick={() => navigate("/main/settings/account/changepassword")}>
        Change password
      </button>
      <Routes>
        <Route path="changepassword" element={<ChangePassword />} />
      </Routes>
    </>
  );
}
