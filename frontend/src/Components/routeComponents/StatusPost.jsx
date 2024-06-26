import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { validateUser } from "../../features/User/userSlice";
import { LeftNavbar, RightNavbar, MidFeedStatus } from "../import";

export default function StatusPost() {
  const { username, postid } = useParams();
  const dispatch = useDispatch();
  const authenticated = useSelector((state) => state.user.authenticated);

  useEffect(() => {
    dispatch(validateUser());
  }, []);

  if (!authenticated) window.location.href = "/login";

  return (
    <div className="grid grid-cols-3 w-screen h-screen">
      <div className="grid-item-1 col-span-1 border-r border-grey-500">
        <LeftNavbar />
      </div>
      <div className="grid-item-2">
        <MidFeedStatus post_id={postid} owner_post={username} />
      </div>
      <div className="grid-item-3">
        <RightNavbar />
      </div>
    </div>
  );
}
