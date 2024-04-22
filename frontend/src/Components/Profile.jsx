import { useParams } from "react-router-dom";
import { LeftNavbar, RightNavbar, Profilefeed } from "./import";
import React from "react";

export default function Profile() {
  const { username } = useParams();

  return (
    <div className="grid grid-cols-3 w-screen h-screen justify-center">
      <div className="grid-item-1 col-span-1 overflow-auto">
        <LeftNavbar />
      </div>
      <Profilefeed username={username} />
      <div className="grid-item-3">
        <RightNavbar />
      </div>
    </div>
  );
}
