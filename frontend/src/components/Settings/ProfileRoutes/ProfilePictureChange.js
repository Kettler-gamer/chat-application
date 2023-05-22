import { useState, useRef } from "react";
import { fetchJson } from "../../../scripts/Fetch";

const image = new Image();
let trackMouse = false;
let x = 0,
  y = 0,
  speed = 1,
  update = true;

export function ProfilePictureChange(props) {
  const [picture, setPicture] = useState(undefined);
  const [slideVal, setSlideVal] = useState(0);
  const [resolution, setResolution] = useState(256);
  const canvasRef = useRef(null);

  async function updateProfilePic() {
    const imageUrl = canvasRef.current.toDataURL();
    const response = await fetchJson("/profilePicture", "PUT", {
      picture: imageUrl,
    });

    if (response.status < 400) {
      props.setProfile((oldValue) => {
        const newValue = oldValue;
        newValue.profilePicture = imageUrl;
        return newValue;
      });
    }
    console.log(await response.text());
  }

  function checkFile(event) {
    const file = event.target.files[0];
    if (
      !file.name.endsWith(".png") &&
      !file.name.endsWith(".jpg") &&
      !file.name.endsWith(".jpeg")
    ) {
      event.target.value = null;
    } else {
      const fileReader = new FileReader();

      fileReader.onloadend = (e) => {
        setPicture(e.target.result);
        setTimeout(() => {
          renderCanvas(e.target.result);
        }, 250);
      };

      fileReader.readAsDataURL(file);
    }
  }

  function renderCanvas(imageUrl) {
    image.src = imageUrl;
    image.onload = () => {
      x = 0;
      y = 0;
      update = true;
      requestAnimationFrame(drawImage.bind(this));
    };
  }

  function onMouseDown() {
    trackMouse = true;
  }

  function onMouseUp() {
    trackMouse = false;
  }

  function onMouseMove(e) {
    if (!trackMouse) return;
    x += -e.movementX * speed;
    y += -e.movementY * speed;

    x = Math.max(0, x);
    y = Math.max(0, y);

    x = Math.min(image.width - resolution, x);
    y = Math.min(image.height - resolution, y);

    update = true;
  }

  function drawImage() {
    if (update && canvasRef.current) {
      update = false;
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, resolution, resolution);
      ctx.drawImage(image, -x, -y);
    }
    requestAnimationFrame(drawImage.bind(this));
  }

  function onSlideMove(e) {
    setSlideVal(e.target.value);
    calculateResolution();
    calculateSpeed();
  }

  function calculateResolution() {
    const newRes = Math.floor(256 + ((1024 - 256) / 75) * slideVal);
    setResolution(newRes);
    update = true;
  }

  function calculateSpeed() {
    speed = Math.floor(1 + ((4 - 1) / 75) * slideVal);
  }

  return (
    <>
      <div className="picture-switch">
        {picture ? (
          <>
            <canvas
              ref={canvasRef}
              width={resolution}
              height={resolution}
              onChange={() => console.log("canvas change")}
              onMouseUp={onMouseUp}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
            />
            <input
              className="res-slider"
              type="range"
              value={slideVal}
              min={0}
              max={75}
              onChange={onSlideMove}
            />
          </>
        ) : (
          <div
            className="profile-pic"
            style={{
              backgroundImage: `url(${
                props.profile?.profilePicture || "/images/profile-pic.webp"
              })`,
            }}></div>
        )}
        {!picture && (
          <label htmlFor="picture-upload">
            <p>Replace</p>
          </label>
        )}
        <input
          id="picture-upload"
          className="profile-pic-input"
          type="file"
          accept=".png,.jpeg,.jpg"
          onChange={checkFile}
        />
        {picture && <button onClick={updateProfilePic}>Set Picture</button>}
      </div>
    </>
  );
}
