import { useNavigate } from "react-router-dom";
import { Form } from "../../Form";
import { useState } from "react";
import { fetchJson } from "../../../scripts/Fetch";

export function ChangePassword(props) {
  const [serverMessage, setServerMessage] = useState("");
  const [status, setStatus] = useState(400);
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setServerMessage("");
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData);

    const response = await fetchJson("/auth/changepassword", "PATCH", values);

    setStatus(response.status);
    setServerMessage(await response.text());
  }

  const inputFieldsValues = [
    { placeholder: "Old Password", name: "oldPassword" },
    { placeholder: "New Password", name: "newPassword" },
    { placeholder: "Confirm Password", name: "confirmPassword" },
  ];

  return status >= 400 ? (
    <Form
      title="Change Password"
      serverMessage={serverMessage}
      onSubmit={onSubmit}
      className="change-password"
      content={
        <>
          {inputFieldsValues.map((values) => (
            <input
              type="password"
              required
              name={values.name}
              placeholder={values.placeholder}
            />
          ))}
        </>
      }
      buttons={
        <>
          <button type="submit">Change password</button>
          <button
            type="button"
            onClick={() => navigate("/main/settings/account")}>
            Cancel
          </button>
        </>
      }
    />
  ) : (
    <div className="finnished-state">
      <p>{serverMessage}</p>
      <button
        className="close-btn"
        onClick={() => navigate("/main/settings/account")}>
        X
      </button>
    </div>
  );
}
