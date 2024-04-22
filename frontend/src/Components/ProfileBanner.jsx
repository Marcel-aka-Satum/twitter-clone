import React, { useState } from "react";

export default function ProfileBanner({ username }) {
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
      {/* User banner */}
      <div className="w-full h-48 bg-blue-500"></div>

      {/* User avatar and profile details */}
      <div className="flex">
        <div className="flex flex-col">
          {/* User avatar */}
          <div>
            <img
              src="https://via.placeholder.com/100"
              alt="User avatar"
              className="relative ml-[50%] -top-12 w-24 h-24 rounded-full border-4 border-white"
            />
          </div>

          {/* User name and description */}
          <div>
            <h2 className="text-xl font-bold ml-[52%]">{username}</h2>
            <h2 className="text-xl font-bold ml-[49%]">@{username}</h2>
            <p className="text-sm text-gray-600">
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum."
            </p>
          </div>
        </div>

        {/* Edit profile button */}
        <div>
          <button className=" bg-black text-white rounded px-4 py-2">
            Edit Profile
          </button>
        </div>
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
