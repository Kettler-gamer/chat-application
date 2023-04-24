import { Contacts } from "../components/Contacts";
import { Contact } from "../components/Contact";
import { useRef, useEffect, useState } from "react";
import { fetchJson } from "../scripts/Fetch";

export function MainPage() {
  const [profile, setProfile] = useState(undefined);
  const [selectedContact, setSelectedContact] = useState(undefined);
  const ref = useRef(false);

  async function getUserProfile() {
    const response = await fetchJson("/user", "GET");

    if (response.status < 400) {
      const data = await response.json();
      setProfile(data);
    } else {
      console.log(await response.text());
    }
  }

  useEffect(() => {
    if (!ref.current) {
      ref.current = true;
      getUserProfile();
    }
  }, []);

  return (
    <main className="main-page">
      <Contacts profile={profile} setSelectedContact={setSelectedContact} />
      <Contact profile={profile} selectedContact={selectedContact} />
    </main>
  );
}
