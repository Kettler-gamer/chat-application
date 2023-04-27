import { fetchJson } from "../scripts/Fetch";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function Settings(props) {
  const [picture, setPicture] = useState(undefined);
  const navigate = useNavigate();

  async function updateProfilePic() {
    const response = await fetchJson("/profilePicture", "PUT", {
      picture: picture,
    });

    if (response.status < 400) {
      props.setProfile((oldValue) => {
        const newValue = oldValue;
        newValue.profilePicture = picture;
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
      };

      fileReader.readAsDataURL(file);
    }
  }

  function onBlackClick(event) {
    if (event.target.className === "black-background") {
      navigate("/main");
    }
  }

  return (
    <div className="black-background" onClick={onBlackClick}>
      <div className="settings-page">
        <div className="picture-switch">
          <img src={picture || "/images/profile-pic.webp"} alt="preview" />
          <label htmlFor="picture-upload">Choose file</label>
          <input
            id="picture-upload"
            className="profile-pic-input"
            type="file"
            accept=".png,.jpeg,.jpg"
            onChange={checkFile}
          />
          {picture && <button onClick={updateProfilePic}>Set Picture</button>}
        </div>
      </div>
    </div>
  );
}
