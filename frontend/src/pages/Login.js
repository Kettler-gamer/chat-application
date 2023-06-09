import { Form } from "../components/Form";
import { fetchJson } from "../scripts/Fetch";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [serverMessage, setServerMessage] = useState("");
  const navigate = useNavigate();

  async function onSubmit(event) {
    event.preventDefault();
    setServerMessage("");

    const formData = new FormData(event.target);

    const body = Object.fromEntries(formData);

    const response = await fetchJson("/auth/login", "POST", body);

    if (response.status < 400) {
      const data = await response.json();
      sessionStorage.setItem("jwtToken", data.jwtToken);
      setServerMessage(data.message);
      navigate("/main");
    } else {
      setServerMessage(await response.text());
    }
  }

  return (
    <main className="login">
      <h1>Chat application</h1>
      <Form
        title="Login"
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
            <button type="submit">Login</button>
            <button type="button" onClick={() => navigate("/register")}>
              Sign up
            </button>
          </>
        }
        serverMessage={<p>{serverMessage}</p>}
      />
    </main>
  );
}
