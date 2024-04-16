import React from "react";

export default function UserAvatarIcon({ avatarUrl }) {
  const style = {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    objectFit: "cover",
  };

  return (
    <img
      src={"http://localhost:8000/" + avatarUrl}
      alt="User Avatar"
      className="bg-blue-500"
      style={style}
    />
  );
}
