import React from "react";

export default function UserAvatarIcon({ avatarUrl, userProfilePath }) {
  const style = {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
  };

  return (
    <a href={userProfilePath}>
      <img
        src={"http://localhost:8000/" + avatarUrl}
        alt="User Avatar"
        className="bg-blue-500"
        style={style}
      />
    </a>
  );
}
