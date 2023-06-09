import { Contacts } from "../components/Contacts/Contacts";
import { useRef, useEffect, useState } from "react";
import { fetchJson } from "../scripts/Fetch";
import { Calling } from "../components/Calling";
import { Call } from "../components/Call";
import { setupPeerConnection } from "../scripts/peer";
import { setUpSocketConnection } from "../scripts/socket";
import { Header } from "../components/Header";
import { Routes, Route } from "react-router-dom";
import { Settings } from "../components/Settings/Settings";
import { ChatSection } from "../components/ChatSection";
import { GroupCall } from "../components/GroupCall/GroupCall";
import { Notifications } from "../components/Notifications";
import info from "../scripts/userinfo";
import { ProfileOverview } from "../components/ProfileOverview";

export function MainPage() {
  const [profile, setProfile] = useState(undefined);
  const [caller, setCaller] = useState("");
  const [call, setCall] = useState(false);
  const [videoStreams, setVideoStreams] = useState([]);
  const [selectedContact, setSelectedContact] = useState(undefined);
  const [selectedChannel, setSelectedChannel] = useState(undefined);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupCall, setGroupCall] = useState(false);
  const [groupCalling, setGroupCalling] = useState("calling");
  const [currentGroup, setCurrentGroup] = useState([]);
  const [notices, setNotices] = useState([]);
  const ref = useRef(false);

  async function getUserProfile() {
    const response = await fetchJson("/user", "GET");

    if (response.status < 400) {
      const data = await response.json();
      setProfile(data);
      info.username = data.username;
      info.contacts = data.contacts;
      setupPeerConnection(
        data.username,
        setCall,
        setCaller,
        setGroupCall,
        setCurrentGroup,
        setGroupCalling,
        setVideoStreams
      );
    } else {
      console.log(await response.text());
    }
  }

  useEffect(() => {
    if (!ref.current) {
      ref.current = true;
      getUserProfile();
      setUpSocketConnection(setProfile, setNotices);
    }
  }, [setProfile]);

  return (
    <main className="main-page">
      <Header profile={profile} />
      <div className="container-contact-comp">
        <Contacts
          profile={profile}
          selectedContact={selectedContact}
          setSelectedContact={setSelectedContact}
          selectedChannel={selectedChannel}
          setSelectedChannel={setSelectedChannel}
          setProfile={setProfile}
          channels={channels}
          setChannels={setChannels}
          setLoading={setLoading}
        />
        {selectedChannel !== undefined || selectedContact !== undefined ? (
          <ChatSection
            profile={profile}
            setProfile={setProfile}
            selectedContact={selectedContact}
            selectedChannel={selectedChannel}
            setCall={setCall}
            setCaller={setCaller}
            channels={channels}
            setChannels={setChannels}
            setSelectedChannel={setSelectedChannel}
            loading={loading}
            setLoading={setLoading}
            setGroupCall={setGroupCall}
            setCurrentGroup={setCurrentGroup}
            setVideoStreams={setVideoStreams}
          />
        ) : (
          <ProfileOverview profile={profile} setProfile={setProfile} />
        )}
      </div>
      {caller !== "" && !call && (
        <Calling
          socket={info.socket}
          caller={caller}
          setCaller={setCaller}
          setCall={setCall}
          setVideoStreams={setVideoStreams}
        />
      )}
      {call && (
        <Call
          caller={caller}
          videoStreams={videoStreams}
          setVideoStreams={setVideoStreams}
        />
      )}
      {groupCall && (
        <GroupCall
          username={profile.username}
          users={currentGroup}
          setUsers={setCurrentGroup}
          groupCalling={groupCalling}
          setGroupCalling={setGroupCalling}
          setGroupCall={setGroupCall}
        />
      )}
      <Routes>
        <Route
          path="/settings/*"
          element={<Settings profile={profile} setProfile={setProfile} />}
        />
      </Routes>
      <Notifications notices={notices} />
      <audio id="localAudio"></audio>
      <audio id="remoteAudio"></audio>
    </main>
  );
}
