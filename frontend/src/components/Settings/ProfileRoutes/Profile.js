import { ProfilePictureChange } from "./ProfilePictureChange";

export function Profile(props) {
  return (
    <>
      <ProfilePictureChange
        setProfile={props.setProfile}
        profile={props.profile}
      />
    </>
  );
}
