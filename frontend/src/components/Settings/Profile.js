import { useState } from "react";
import { fetchJson } from "../../scripts/Fetch";

export function Profile(props) {
  const [picture, setPicture] = useState(undefined);
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

  return (
    <>
      <div className="picture-switch">
        <img
          src={
            picture ||
            props.profile.profilePicture ||
            "/images/profile-pic.webp"
          }
          alt="preview"
        />
        <label htmlFor="picture-upload">
          <p>Replace</p>
        </label>
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
