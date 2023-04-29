import { Contacts } from "../components/Contacts";
import { useRef, useEffect, useState } from "react";
import { fetchJson } from "../scripts/Fetch";
import { Calling } from "../components/Calling";
import { Call } from "../components/Call";
import { setupPeerConnection } from "../scripts/peer";
import { setUpSocketConnection } from "../scripts/socket";
import { Header } from "../components/Header";
import { Routes, Route } from "react-router-dom";
import { Settings } from "../components/Settings";
import { ChatSection } from "../components/ChatSection";

export const info = {
  peer: undefined,
  socket: undefined,
  conn: undefined,
  currentCall: undefined,
};

export function MainPage() {
  const [profile, setProfile] = useState(undefined);
  const [caller, setCaller] = useState("");
  const [call, setCall] = useState(false);
  const [selectedContact, setSelectedContact] = useState(undefined);
  const [selectedChannel, setSelectedChannel] = useState(undefined);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef(false);

  async function getUserProfile() {
    const response = await fetchJson("/user", "GET");

    if (response.status < 400) {
      const data = await response.json();
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
      setUpSocketConnection(setProfile);
    }
  }, [setProfile]);

  return (
    <main className="main-page">
      <Header profile={profile} />
      <div className="container-contact-comp">
        <Contacts
          profile={profile}
          setSelectedContact={setSelectedContact}
          setSelectedChannel={setSelectedChannel}
          setProfile={setProfile}
          channels={channels}
          setChannels={setChannels}
          setLoading={setLoading}
        />
        <ChatSection
          profile={profile}
          selectedContact={selectedContact}
          selectedChannel={selectedChannel}
          setCall={setCall}
          setCaller={setCaller}
          channels={channels}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
      {caller !== "" && !call && (
        <Calling
          socket={info.socket}
          caller={caller}
          setCaller={setCaller}
          setCall={setCall}
        />
      )}
      {call && <Call caller={caller} />}
      <Routes path="*">
        <Route
          path="/settings"
          element={<Settings setProfile={setProfile} />}
        />
      </Routes>
      <audio id="localAudio"></audio>
      <audio id="remoteAudio"></audio>
    </main>
  );
}
