import { useParams } from "react-router-dom";
import { LeftNavbar, RightNavbar, Profilefeed } from "../import";
import React from "react";

export default function Profile() {
  const { username } = useParams();

  return (
    <div className="grid grid-cols-3 max-w-screen h-screen">
      <div className="grid-item-1 col-span-1 border-r border-grey-500">
        <LeftNavbar />
      </div>
      <div className="grid-items-2 col-span-1">
        <Profilefeed username={username} />
      </div>
      <div className="grid-item-3">
        <RightNavbar />
      </div>
    </div>
  );
}
