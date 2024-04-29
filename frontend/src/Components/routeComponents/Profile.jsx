import { useParams } from "react-router-dom";
import { LeftNavbar, RightNavbar, Profilefeed } from "../import";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchUser } from "../../features/User/userSlice";

export default function Profile() {
  const { username } = useParams();
  const [isUsersProfile, setIsUsersProfile] = React.useState(false);
  const currentUser = useSelector((state) => state.user.user);

  useEffect(() => {
    if (currentUser && currentUser.username === username) {
      setIsUsersProfile(true);
    }
  }, []);

  if (currentUser === null) {
    return <div>loading...</div>;
  }

  return (
    <div className="grid grid-cols-3 max-w-screen h-screen">
      <div className="grid-item-1 col-span-1 border-r border-grey-500">
        <LeftNavbar />
      </div>
      <div className="grid-items-2 col-span-1">
        <Profilefeed username={username} usersProfile={isUsersProfile} />
      </div>
      <div className="grid-item-3">
        <RightNavbar />
      </div>
    </div>
  );
}
