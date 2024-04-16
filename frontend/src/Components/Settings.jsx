import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { patchUser } from "../features/User/userSlice";

export default function Settings() {
  const [userName, setUserName] = useState("");
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [update, setUpdate] = useState(false);
  const dispatch = useDispatch();

  const handleAvatarChange = (event) => {
    setAvatar(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      username: userName,
      nickname: nickName,
      email: email,
      avatar: avatar,
    };
    dispatch(patchUser({ user_id: 1, data: data })).then((action) => {
      if (patchUser.fulfilled.match(action)) {
        setUpdate(true);
      } else {
        setUpdate(false);
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="mb-4">Settings</h1>
      {update && <p className="text-green-500">User updated successfully</p>}
      <form onSubmit={handleSubmit} className="space-y-4 text-red-500">
        <label className="flex flex-col">
          Username:
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="px-2 py-1 rounded-md"
          />
        </label>

        <label className="flex flex-col">
          Nickname:
          <input
            type="text"
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            className="px-2 py-1 rounded-md"
          />
        </label>

        <label className="flex flex-col">
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-2 py-1 rounded-md"
          />
        </label>
        <label className="flex flex-col">
          Avatar:
          <input
            type="file"
            onChange={handleAvatarChange}
            className="px-2 py-1 rounded-md"
          />
        </label>
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-white text-red-500"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
