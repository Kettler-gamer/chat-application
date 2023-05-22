import { useState, useRef } from "react";
import { fetchJson } from "../../../scripts/Fetch";

const image = new Image();
let trackMouse = false;
let x = 0,
  y = 0,
  speed = 1;

let slideMouse = false;

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
      const ctx = canvasRef.current.getContext("2d");
      ctx.drawImage(image, 0, 0);
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

    drawImage();
  }

  function onSlideDown() {
    slideMouse = true;
  }

  function onSlideUp() {
    slideMouse = false;
    drawImage();
  }

  function drawImage() {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, resolution, resolution);
    ctx.drawImage(image, -x, -y);
  }

  function onSlideMove(e) {
    if (!slideMouse) return;
    setSlideVal((oldValue) => {
      let newValue = oldValue;
      newValue += 0.45 * e.movementX;

      newValue = Math.max(0, newValue);
      newValue = Math.min(75, newValue);

      return newValue;
    });
    calculateResolution();
    calculateSpeed();
  }

  function calculateResolution() {
    setResolution(Math.floor(256 + ((1024 - 256) / 75) * slideVal));
    drawImage();
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
              onMouseUp={onMouseUp}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
            />
            <div className="resolution">
              <div className="slider-container">
                <div
                  className="slider"
                  onMouseUp={onSlideUp}
                  onMouseLeave={onSlideUp}
                  onMouseDown={onSlideDown}
                  onMouseMove={onSlideMove}
                  style={{ marginLeft: `${slideVal}%` }}></div>
              </div>
            </div>
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
