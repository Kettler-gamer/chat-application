import { useState, useRef } from "react";
import { fetchJson } from "../../scripts/Fetch";

const image = new Image();
let trackMouse = false;
let x = 0,
  y = 0;

export function Profile(props) {
  const [picture, setPicture] = useState(undefined);
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
    x += -e.movementX;
    y += -e.movementY;

    x = Math.max(0, x);
    y = Math.max(0, y);

    x = Math.min(image.width, x);
    y = Math.min(image.height, y);

    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, 512, 512);
    ctx.drawImage(image, -x, -y);
  }

  return (
    <>
      <div className="picture-switch">
        {picture ? (
          <>
            <canvas
              width={512}
              height={512}
              ref={canvasRef}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
              onMouseMove={onMouseMove}
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
