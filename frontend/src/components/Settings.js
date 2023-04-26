import { fetchJson } from "../scripts/Fetch";

export function Settings(props) {
  function updateProfilePic() {
    const file = document.querySelector(".profile-pic-input").files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = async (event) => {
      const response = await fetchJson("/profilePicture", "PUT", {
        picture: event.target.result,
      });

      console.log(await response.text());
    };
    fileReader.readAsDataURL(file);
    // console.log(file);
  }

  return (
    <div className="settings-page">
      <input className="profile-pic-input" type="file" />
      <button onClick={updateProfilePic}>Set Picture</button>
    </div>
  );
}
