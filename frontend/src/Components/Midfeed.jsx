import React, { useState, useEffect } from "react";
import { useColorMode } from "@chakra-ui/react";
import { UserAvatarIcon, Post } from "./import";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faSmile, faClock } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserPosts,
  validateUser,
  deleteUserPost,
  createPost,
  fetchUserById,
} from "../features/User/userSlice";

export default function Midfeed() {
  let userDataLocalStorage = JSON.parse(window.localStorage.getItem("user"));
  const posts = useSelector((state) => state.user.posts);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredSmile, setIsHoveredSmile] = useState(false);
  const [isHoveredSchedule, setIsHoveredSchedule] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const { colorMode, toggleColorMode } = useColorMode();

  const changeColor = () => {
    if (colorMode === "dark") {
      // If the current color mode is dark, switch to system color mode
      const systemColorMode = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "system";
      toggleColorMode(systemColorMode);
    } else {
      // If the current color mode is not dark, switch to dark mode
      toggleColorMode("dark");
    }
  };

  useEffect(() => {
    if (userDataLocalStorage) {
      dispatch(fetchUserById(userDataLocalStorage.id));
      dispatch(fetchUserPosts(userDataLocalStorage.id));
    }
    dispatch(validateUser());
  }, []);

  const handleDelete = (post_id) => {
    dispatch(deleteUserPost(post_id));
  };

  const handleSubmit = () => {
    const date = new Date().toISOString();
    const formData = new FormData();
    formData.append("message", message);
    formData.append("owner_id", userDataLocalStorage.id);
    formData.append("created_on", date);
    if (uploadFiles) {
      uploadFiles.forEach((file, index) => {
        formData.append("files", file);
      });
    }
    setMessage("");
    setUploadFiles([]);
    dispatch(createPost(formData));
  };

  const handleFileUpload = (event) => {
    const newFilesArr = [];
    for (let i = 0; i < event.target.files.length; i++) {
      newFilesArr.push(event.target.files[i]);
    }
    setUploadFiles(newFilesArr);
  };

  const deleteFromUserPosts = (index) => {
    const newUploadFiles = uploadFiles.filter((file, i) => i !== index);
    setUploadFiles(newUploadFiles);
  };

  return (
    <div className="grid-item-2 overflow-auto min-w-[300px]">
      <div className="flex border-t border-gray-500 items-center justify-center mb-4 text-gray-500 ">
        <span className="font-bold flex-1 text-lg ">For you</span>
        <span className="font-bold flex-1 text-lg">Following</span>
        <button onClick={changeColor}>change color</button>
      </div>

      <div className="flex flex-row border-t border-b border-gray-500 py-2 mb-4 w-full">
        <div className="user-avatar mr-4">
          {userDataLocalStorage && userDataLocalStorage.avatar && (
            <UserAvatarIcon avatarUrl={userDataLocalStorage.avatar} />
          )}
        </div>
        <div className="grow">
          <div className="text-white p-4">
            <textarea
              className="w-full h-32 bg-gray-800 text-white p-2 mb-4"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            {uploadFiles &&
              uploadFiles.map((file, index) => (
                <>
                  <p className="text-blue-500" key={index}>
                    {file.name}
                    <button
                      className="ml-4 text-white"
                      onClick={() => deleteFromUserPosts(index)}
                    >
                      X
                    </button>
                  </p>
                </>
              ))}
            <div className="flex items-center justify-between">
              <div className="flex space-x-4 gap-12">
                <label>
                  <FontAwesomeIcon
                    icon={faImage}
                    className={`text-blue-500 cursor-pointer ${
                      isHovered ? "border-2 border-blue-500 rounded" : ""
                    }`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  />
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    multiple
                    style={{ display: "none" }}
                  />
                </label>
                <FontAwesomeIcon
                  icon={faSmile}
                  className={`text-blue-500 cursor-pointer ${
                    isHoveredSmile ? "border-2 border-blue-500 rounded" : ""
                  }`}
                  onMouseEnter={() => setIsHoveredSmile(true)}
                  onMouseLeave={() => setIsHoveredSmile(false)}
                />
                <FontAwesomeIcon
                  icon={faClock}
                  className={`text-blue-500 cursor-pointer ${
                    isHoveredSchedule ? "border-2 border-blue-500 rounded" : ""
                  }`}
                  onMouseEnter={() => setIsHoveredSchedule(true)}
                  onMouseLeave={() => setIsHoveredSchedule(false)}
                />
              </div>
              <button
                className="bg-blue-500 rounded-full text-white  px-4 py-2"
                onClick={handleSubmit}
              >
                POST
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {posts &&
          posts.map((post) => (
            <Post
              key={post.id}
              nickname={post.nickname}
              username={post.username}
              amountOfComments={post.amountOfComments}
              amountOfLikes={post.amountOfLikes}
              amountOfReposts={post.amountOfRepost}
              post_id={post.id}
              timePosted={post.created_on}
              message={post.message}
              owner_id={post.owner_id}
              files={post.files}
              avatarUrl={userDataLocalStorage.avatar}
              onDelete={() => handleDelete(post.id)}
            />
          ))}
      </div>
    </div>
  );
}
