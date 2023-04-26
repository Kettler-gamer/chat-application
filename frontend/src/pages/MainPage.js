import { Contacts } from "../components/Contacts";
import { Contact } from "../components/Contact";
import { useRef, useEffect, useState } from "react";
import { fetchJson } from "../scripts/Fetch";
import { Calling } from "../components/Calling";
import { Call } from "../components/Call";
import { Caller } from "../components/Caller";
import { setupPeerConnection } from "../scripts/peer";
import { setUpSocketConnection } from "../scripts/socket";

export const info = {
  peer: undefined,
  socket: undefined,
  audio: new Audio(),
  conn: undefined,
  currentCall: undefined,
};

export function MainPage() {
  const [profile, setProfile] = useState(undefined);
  const [caller, setCaller] = useState("");
  const [call, setCall] = useState(false);
  const [selectedContact, setSelectedContact] = useState(undefined);
  const ref = useRef(false);

  async function getUserProfile() {
    const response = await fetchJson("/user", "GET");

    if (response.status < 400) {
      const data = await response.json();
      console.log(data);
      setProfile(data);
      setupPeerConnection(data.username, setCall, setCaller);
    } else {
      console.log(await response.text());
    }
  }

  useEffect(() => {
    if (!ref.current) {
      ref.current = true;
      getUserProfile();
      setUpSocketConnection();
    }
  });

  return (
    <main className="main-page">
      <Contacts
        profile={profile}
        setSelectedContact={setSelectedContact}
        setProfile={setProfile}
      />
      <Contact
        profile={profile}
        selectedContact={selectedContact}
        socket={info.socket}
        setCall={setCall}
        setCaller={setCaller}
      />
      {caller !== "" && !call && (
        <Calling
          socket={info.socket}
          caller={caller}
          setCaller={setCaller}
          setCall={setCall}
        />
      )}
      {call && caller === "" && <Caller />}
      {call && caller !== "" && (
        <Call
          socket={info.socket}
          caller={caller}
          setCaller={setCaller}
          setCall={setCall}
        />
      )}
      <audio id="localAudio"></audio>
      <audio id="remoteAudio"></audio>
    </main>
  );
}
