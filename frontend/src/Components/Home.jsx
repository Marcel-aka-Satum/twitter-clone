import React, { useState, useEffect } from "react";
import { Post, LeftNavbar, RightNavbar } from "./import";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faSmile, faClock } from "@fortawesome/free-solid-svg-icons";
import {
  createPost,
  deleteUserPost,
  fetchUserPosts,
} from "../features/User/userSlice";

export default function Home() {
  let userDataLocalStorage = JSON.parse(window.localStorage.getItem("user"));
  const posts = useSelector((state) => state.user.posts);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredSmile, setIsHoveredSmile] = useState(false);
  const [isHoveredSchedule, setIsHoveredSchedule] = useState(false);

  const handleDelete = (post_id) => {
    dispatch(deleteUserPost(post_id));
  };

  const handleSubmit = () => {
    const date = new Date().toISOString();
    const formData = new FormData();
    formData.append("message", message);
    formData.append("owner_id", userDataLocalStorage.id);
    formData.append("created_on", date);
    dispatch(createPost(formData));
  };

  useEffect(() => {
    if (userDataLocalStorage) {
      dispatch(fetchUserPosts(userDataLocalStorage.id));
    }
  }, []);

  const handleFileUpload = (event) => {
    console.log(event.target.files);
  };

  return (
    <div className="grid grid-cols-3 w-screen h-screen justify-center">
      <div className="grid-item-1 ">
        <LeftNavbar />
      </div>
      {/*middle homepage */}
      <div className="grid-item-2 border border-gray-500 ">
        <div className="flex items-center justify-center mb-4 text-gray-500 ">
          <span className="font-bold flex-1 text-lg ">For you</span>
          <span className="font-bold flex-1 text-lg">Following</span>
        </div>

        <div className="flex flex-row border border-gray-500 py-2 mb-4 w-full">
          <div className="user-avatar text-red-500">avatar</div>
          <div className="grow">
            <div className=" bg-black text-white p-4">
              <textarea
                className="w-full h-32 bg-gray-800 text-white p-2 mb-4"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
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
                      isHoveredSchedule
                        ? "border-2 border-blue-500 rounded"
                        : ""
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
                post_id={post.id}
                timePosted={post.created_on}
                message={post.message}
                owner_id={post.owner_id}
                onDelete={() => handleDelete(post.id)}
              />
            ))}
        </div>
      </div>

      <div className="grid-item-3">
        <RightNavbar />
      </div>
    </div>
  );
}
