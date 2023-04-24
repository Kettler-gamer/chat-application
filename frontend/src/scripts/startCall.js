import { info } from "../pages/MainPage";

export function onStartCall(socket) {
  info.audioRecorder.ondataavailable = (blob) => {
    const fileReader = new FileReader();

    fileReader.onloadend = (event) => {
      if (info.mute) return;
      socket.emit("voice", event.target.result);
      info.audioRecorder.start();
      setTimeout(() => {
        info.audioRecorder.stop();
      }, 500);
    };

    fileReader.readAsDataURL(blob.data);
  };

  info.audioRecorder.start();
  setTimeout(() => {
    info.audioRecorder.stop();
  }, 500);
}
