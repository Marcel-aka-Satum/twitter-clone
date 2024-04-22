import React from "react";

export default function ProfileBanner({ username }) {
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
      <div className="mt-4 flex justify-around border border-gray-200 pt-1">
        <button className="px-2 py-1">Posts</button>
        <button className="px-2 py-1">Replies</button>
        <button className="px-2 py-1">Highlights</button>
        <button className="px-2 py-1">Articles</button>
        <button className="px-2 py-1">Media</button>
        <button className="px-2 py-1">Likes</button>
      </div>
    </div>
  );
}
