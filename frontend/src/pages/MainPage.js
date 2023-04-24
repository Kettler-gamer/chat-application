import { Contacts } from "../components/Contacts";
import { Contact } from "../components/Contact";
import { useRef, useEffect, useState } from "react";
import { fetchJson } from "../scripts/Fetch";
import io from "socket.io-client";
import { Calling } from "../components/Calling";
import { Call } from "../components/Call";
import { onStartCall } from "../scripts/startCall";

export const info = {
  audioRecorder: undefined,
  mute: false,
  socket: undefined,
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
      setProfile(data);
    } else {
      console.log(await response.text());
    }
  }

  function onEndCall() {
    setCaller("");
    setCall(false);
    info.mute = true;
    setTimeout(() => {
      info.mute = false;
    }, 1000);
  }

  async function setupSocket() {
    const newSocket = io("/", {
      extraHeaders: { jwtToken: sessionStorage.getItem("jwtToken") },
    });
    newSocket.on("connect", () => {
      console.log("Connect");
      info.socket = newSocket;
    });
    newSocket.on("startCall", (person) => {
      setCaller(person);
      setCall(true);
      onStartCall(info.socket);
    });
    newSocket.on("endCall", onEndCall);
    newSocket.on("call", (caller) => {
      setCaller(caller);
    });
    newSocket.on("voice", (data) => {
      const audio = new Audio(data);
      audio.play();
    });
    newSocket.on("serverMessage", (message) => {
      console.log(message);
    });
  }

  useEffect(() => {
    if (!ref.current) {
      ref.current = true;
      getUserProfile();
      setupSocket();
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        info.audioRecorder = new MediaRecorder(stream);
      });
    }
  });

  return (
    <main className="main-page">
      <Contacts profile={profile} setSelectedContact={setSelectedContact} />
      <Contact
        profile={profile}
        selectedContact={selectedContact}
        socket={info.socket}
      />
      {caller !== "" && !call && (
        <Calling socket={info.socket} caller={caller} setCall={setCall} />
      )}
      {call && (
        <Call
          socket={info.socket}
          caller={caller}
          setCaller={setCaller}
          setCall={setCall}
        />
      )}
    </main>
  );
}
