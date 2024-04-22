import React, { useState } from "react";

export default function ProfileBanner({
  username,
  avatarUrl,
  description,
  nickname,
}) {
  const [visible, setVisible] = useState({
    posts: true,
    replies: false,
    media: false,
    likes: false,
  });

  const handleVisibility = (e) => {
    const name = e.target.innerText.toLowerCase();
    setVisible({
      ...visible,
      posts: false,
      replies: false,
      media: false,
      likes: false,
      [name]: true,
    });
  };
  return (
    <div>
      <div className="w-full h-48 bg-blue-500"></div>

      <div className="flex justify-between w-full px-4">
        <div>
          <img
            src={`http://localhost:8000/${avatarUrl}`}
            alt="User avatar"
            className="relative -top-12 w-24 h-24 rounded-full border-4 border-white"
          />
          <h2 className="text-xl font-bold">{nickname}</h2>
          <h2 className="text-xl font-bold">@{username}</h2>
        </div>

        <div className="flex items-center">
          <button className="bg-black text-white rounded-full px-4 py-2 flex-shrink-0 ml-4">
            Edit Profile
          </button>
        </div>
      </div>

      <div className="px-4">
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum."
      </div>

      {/* Footer */}
      <div className="flex mt-4 justify-around border-t border-b border-gray-500 pt-1">
        <div className="flex flex-col">
          <button className="px-2 py-1" onClick={handleVisibility}>
            Posts
          </button>
          {visible.posts && (
            <div className="w-14 h-1 bg-blue-500 rounded-full"></div>
          )}
        </div>
        <button className="px-2 py-1" onClick={handleVisibility}>
          Replies
          {visible.replies && (
            <div className="w-14 h-1 bg-blue-500 rounded-full"></div>
          )}
        </button>
        <button className="px-2 py-1" onClick={handleVisibility}>
          Media
          {visible.media && (
            <div className="w-14 h-1 bg-blue-500 rounded-full"></div>
          )}
        </button>
        <button className="px-2 py-1" onClick={handleVisibility}>
          Likes
          {visible.likes && (
            <div className="w-14 h-1 bg-blue-500 rounded-full"></div>
          )}
        </button>
      </div>
    </div>
  );
}
