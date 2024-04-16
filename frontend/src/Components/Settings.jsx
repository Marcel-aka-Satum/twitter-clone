import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { patchUser } from "../features/User/userSlice";
import AvatarEditor from "react-avatar-editor";

export default function Settings() {
  const [userName, setUserName] = useState("");
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [update, setUpdate] = useState(false);
  const [popup, setPopup] = useState(false); //pops the canvas if user wants to change the avatar
  const editorRef = useRef();
  let userDataLocalStorage = JSON.parse(window.localStorage.getItem("user"));
  const dispatch = useDispatch();

  const handleAvatarChange = (event) => {
    setAvatar(event.target.files[0]);
    setPopup(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      username: userName,
      nickname: nickName,
      email: email,
      avatar: avatar,
    };
    dispatch(patchUser({ user_id: userDataLocalStorage.id, data: data })).then(
      (action) => {
        if (patchUser.fulfilled.match(action)) {
          setUpdate(true);
        } else {
          setUpdate(false);
        }
      }
    );
  };

  const saveNewAvatar = () => {
    const canvas = editorRef.current.getImageScaledToCanvas().toDataURL();
    setAvatar(canvas);
    setPopup(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="mb-4">Settings</h1>
      {avatar && popup && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(5px)",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <div className="bg-black">
                <AvatarEditor
                  ref={editorRef}
                  image={avatar}
                  width={200}
                  height={200}
                  border={50}
                  color={[255, 255, 255, 0.6]} // RGBA
                  scale={1.2}
                  rotate={0}
                />
              </div>
              <button
                onClick={saveNewAvatar}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full float-right"
              >
                Ok
              </button>
            </div>
          </div>
        </>
      )}

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
