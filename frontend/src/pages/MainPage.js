import { Contacts } from "../components/Contacts";
import { Contact } from "../components/Contact";
import { useRef, useEffect, useState } from "react";
import { fetchJson } from "../scripts/Fetch";
import io from "socket.io-client";
import { Calling } from "../components/Calling";
import { Call } from "../components/Call";
import { Caller } from "../components/Caller";
import { Peer } from "peerjs";

export const info = {
  peer: undefined,
  audioRecorder: undefined,
  mute: false,
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
      setProfile(data);
      setUpMicrophone(data.username);
    } else {
      console.log(await response.text());
    }
  }

  function setUpMicrophone(username) {
    info.peer = new Peer(username, {
      host: window.location.hostname,
      debug: 1,
      path: "/peer",
    });
    info.peer.on("connection", (connection) => {
      console.log("Peer connection!");
      info.conn = connection;
      connection.on("close", () => {
        console.log("Close connection!");
        setCall(false);
        setCaller("");
      });
    });
    info.peer.on("error", (error) => {
      console.log(error);
    });
    info.peer.on("call", (call) => {
      setCaller(call.peer);
      info.currentCall = call;
    });
    window.peer = info.peer;
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      window.localStream = stream;
      window.localAudio.srcObject = stream;
      info.audioRecorder = new MediaRecorder(stream);
    });
  }

  async function setupSocket() {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    const newSocket = io("/", {
      extraHeaders: { jwtToken: sessionStorage.getItem("jwtToken") },
    });
    newSocket.on("connect", () => {
      info.socket = newSocket;
    });
    newSocket.on("connection_error", () => {
      console.log("Connection error!");
    });
    newSocket.on("serverMessage", (message) => {
      console.log(message);
    });
    return promise;
  }

  useEffect(() => {
    if (!ref.current) {
      ref.current = true;
      getUserProfile();
      setupSocket();
    }
  });

  return (
    <main className="main-page">
      <Contacts profile={profile} setSelectedContact={setSelectedContact} />
      <Contact
        profile={profile}
        selectedContact={selectedContact}
        socket={info.socket}
        setCall={setCall}
        setCaller={setCaller}
        setupSocket={setupSocket}
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
