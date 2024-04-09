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
      src={
        "https://cdn.icon-icons.com/icons2/1919/PNG/512/avatarinsideacircle_122011.png"
      }
      alt="User Avatar"
      style={style}
    />
  );
}
