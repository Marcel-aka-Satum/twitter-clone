import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { patchUser } from "../../features/User/userSlice";
import AvatarEditor from "react-avatar-editor";

export default function Settings() {
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [banner, setBanner] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState("");
  const [update, setUpdate] = useState(false);
  const [popupAvatar, setPopupAvatar] = useState(false); //pops the canvas if user wants to change the avatar
  const [popupBanner, setPopUpBanner] = useState(false); //pops the canvas if user wants to change the banner
  const [badPassword, setBadPassword] = useState(false); //checks if the password is correct
  const editorRef = useRef();
  let userDataLocalStorage = JSON.parse(window.localStorage.getItem("user"));
  const dispatch = useDispatch();

  const handleAvatarChange = (event) => {
    setAvatar(event.target.files[0]);
    setPopupAvatar(true);
  };

  const handleBannerChange = (event) => {
    setBanner(event.target.files[0]);
    setPopUpBanner(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setBadPassword(true);
      return;
    }
    const data = {
      nickname: nickName,
      email: email,
      avatar: avatar,
      banner: banner,
      description: bio,
      password: password,
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
    setPopupAvatar(false);
  };

  const saveNewBanner = () => {
    const canvas = editorRef.current.getImageScaledToCanvas().toDataURL();
    setBanner(canvas);
    setPopUpBanner(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="mb-4">
        <i className="fas fa-cog fa-2x mr-4"></i>
        Settings
      </h1>
      {badPassword && <p className="text-red-500">Passwords do not match</p>}
      {avatar && popupAvatar && (
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
      {banner && popupBanner && (
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
                image={banner}
                width={400}
                height={200}
                border={50}
                color={[255, 255, 255, 0.6]} // RGBA
                scale={1.2}
                rotate={0}
              />
            </div>
            <button
              onClick={saveNewBanner}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full float-right"
            >
              Ok
            </button>
          </div>
        </div>
      )}

      {update && <p className="text-green-500">User updated successfully</p>}
      <form onSubmit={handleSubmit} className="space-y-4 text-red-500">
        <label className="flex flex-col">
          Nickname:
          <input
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            className="px-2 py-1 rounded-md"
            placeholder="Enter your nickname"
          />
        </label>
        <label className="flex flex-col">
          Email:
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-2 py-1 rounded-md"
            placeholder="Enter your email"
          />
        </label>
        <label className="flex flex-col">
          Password:
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-2 py-1 rounded-md"
            placeholder="Enter your password"
          />
        </label>
        <label className="flex flex-col">
          Confirm Password:
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="px-2 py-1 rounded-md"
            placeholder="Confirm your password"
          />
        </label>
        <label className="flex flex-col">
          Bio description:
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="text-red-500 px-2 py-1 rounded-md h-24"
            placeholder="Write a short bio about yourself."
          ></textarea>
        </label>

        <label className="flex flex-col">
          Avatar:
          <input
            type="file"
            onChange={handleAvatarChange}
            className="px-2 py-1 rounded-md"
          />
        </label>
        <label className="flex flex-col">
          Banner:
          <input
            type="file"
            onChange={handleBannerChange}
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
      <a
        href={"/"}
        className="mt-5 font-bold hover:text-blue-500 transition-colors"
      >
        Go back to homepage
      </a>
    </div>
  );
}
