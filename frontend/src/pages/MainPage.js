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
import { GroupCalling } from "../components/GroupCalling";

export const info = {
  username: undefined,
  peer: undefined,
  socket: undefined,
  conn: undefined,
  currentCall: undefined,
  conns: [],
  calls: [],
};

export function MainPage() {
  const [profile, setProfile] = useState(undefined);
  const [caller, setCaller] = useState("");
  const [call, setCall] = useState(false);
  const [selectedContact, setSelectedContact] = useState(undefined);
  const [selectedChannel, setSelectedChannel] = useState(undefined);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupCall, setGroupCall] = useState(false);
  const [groupCalling, setGroupCalling] = useState("calling");
  const [currentGroup, setCurrentGroup] = useState([]);
  const ref = useRef(false);

  async function getUserProfile() {
    const response = await fetchJson("/user", "GET");

    if (response.status < 400) {
      const data = await response.json();
      setProfile(data);
      info.username = data.username;
      setupPeerConnection(
        data.username,
        setCall,
        setCaller,
        setGroupCall,
        setCurrentGroup,
        setGroupCalling
      );
    } else {
      console.log(await response.text());
    }
  }

  useEffect(() => {
    if (!ref.current) {
      ref.current = true;
      getUserProfile();
      setUpSocketConnection(setProfile, setChannels, setSelectedChannel);
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
          setChannels={setChannels}
          loading={loading}
          setLoading={setLoading}
          setGroupCall={setGroupCall}
          setCurrentGroup={setCurrentGroup}
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
      {groupCall && (
        <GroupCalling
          username={profile.username}
          users={currentGroup}
          setUsers={setCurrentGroup}
          groupCalling={groupCalling}
          setGroupCalling={setGroupCalling}
          setGroupCall={setGroupCall}
        />
      )}
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
