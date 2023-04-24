import { Contacts } from "../components/Contacts";
import { Contact } from "../components/Contact";
import { useRef, useEffect, useState } from "react";
import { fetchJson } from "../scripts/Fetch";
import io from "socket.io-client";
import { Calling } from "../components/Calling";

export function MainPage() {
  const [socket, setSocket] = useState(undefined);
  const [profile, setProfile] = useState(undefined);
  const [caller, setCaller] = useState("");
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

  function onStartCall(socket) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const audioRecorder = new MediaRecorder(stream);

      console.log(audioRecorder);
      audioRecorder.ondataavailable = (blob) => {
        const fileReader = new FileReader();

        fileReader.onloadend = (event) => {
          console.log(event.target.result);
          socket.emit("voice", event.target.result);
          audioRecorder.start();
          setTimeout(() => {
            audioRecorder.stop();
          }, 500);
        };

        fileReader.readAsDataURL(blob.data);
      };

      audioRecorder.start();
      setTimeout(() => {
        audioRecorder.stop();
      }, 500);
    });
  }

  async function setupSocket() {
    const socket = io("/", {
      extraHeaders: { jwtToken: sessionStorage.getItem("jwtToken") },
    });
    socket.on("connect", () => {
      console.log("Connect");
      setSocket(socket);
    });
    socket.on("connect_error", (message) => {
      console.log(message);
    });
    socket.on("disconnect", (message) => {
      console.log(message);
    });
    socket.on("disconnecting", (message) => {
      console.log(message);
    });
    socket.on("startCall", () => onStartCall(socket));
    socket.on("call", (caller) => {
      console.log(caller, " is calling!");
      setCaller(caller);
    });
    socket.on("voice", (data) => {
      const audio = new Audio(data);
      audio.play();
    });
    socket.on("serverMessage", (message) => {
      console.log(message);
    });
  }

  useEffect(() => {
    if (!ref.current) {
      ref.current = true;
      getUserProfile();
      setupSocket();
    }
  }, []);

  return (
    <main className="main-page">
      <Contacts profile={profile} setSelectedContact={setSelectedContact} />
      <Contact
        profile={profile}
        selectedContact={selectedContact}
        socket={socket}
      />
      {caller !== "" && <Calling socket={socket} caller={caller} />}
    </main>
  );
}
