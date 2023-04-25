import { fetchJson } from "../scripts/Fetch";
import { Form } from "../components/Form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SignUp() {
  const [serverMessage, setServerMessage] = useState("");
  const navigate = useNavigate();

  async function onSubmit(event) {
    event.preventDefault();
    setServerMessage("");

    const formData = new FormData(event.target);

    const body = Object.fromEntries(formData);

    const response = await fetchJson("/auth/register", "PUT", body);

    setServerMessage(await response.text());
  }

  return (
    <main className="login">
      <h1>Chat application</h1>
      <Form
        title="Sign Up"
        onSubmit={onSubmit}
        content={
          <>
            <input required name="username" placeholder="Username" />
            <input
              required
              type="password"
              name="password"
              placeholder="Password"
            />
          </>
        }
        buttons={
          <>
            <button type="submit">Sign up</button>
            <button type="button" onClick={() => navigate("/")}>
              Cancel
            </button>
          </>
        }
        serverMessage={<p>{serverMessage}</p>}
      />
    </main>
  );
}
