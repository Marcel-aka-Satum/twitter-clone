import { useParams } from "react-router-dom";
import { LeftNavbar, RightNavbar, Profilefeed } from "../import";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Profile() {
  const { username } = useParams();
  const [isUsersProfile, setIsUsersProfile] = useState(false);
  const currentUser = useSelector((state) => state.user.user);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  useEffect(() => {
    if (currentUser && currentUser.username === username) {
      setIsUsersProfile(true);
      setAuthenticatedUser(currentUser);
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
