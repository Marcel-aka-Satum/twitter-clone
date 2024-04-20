import React, { useState, useEffect } from "react";
import { useColorMode } from "@chakra-ui/react";
import { UserAvatarIcon, Post } from "./import";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faSmile, faClock } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPostById,
  fetchCommentsByPostId,
} from "../features/Post/postSlice";
import { fetchUserByUserName } from "../features/User/userSlice";

export default function MidFeedStatus({ post_id, owner_post }) {
  const userDataLocalStorage = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredSmile, setIsHoveredSmile] = useState(false);
  const [isHoveredSchedule, setIsHoveredSchedule] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const { colorMode, toggleColorMode } = useColorMode();
  const post = useSelector((state) => state.post.post);
  const comments = useSelector((state) => state.post.comments);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(fetchPostById(post_id));
    dispatch(fetchCommentsByPostId(post_id));
    dispatch(fetchUserByUserName(owner_post));
  }, []);
  const handleDelete = (post_id) => {};
  return (
    <div className="grid-item-2 border border-gray-500 overflow-auto min-w-[300px]">
      <div className="flex items-center justify-center mb-4 text-gray-500 ">
        <span className="font-bold flex-1 text-lg ">For you</span>
        <span className="font-bold flex-1 text-lg">Following</span>
        {/* <button onClick={changeColor}>change color</button> */}
      </div>
      <div className="flex flex-row border border-gray-500 py-2 mb-4 w-full">
        <div className="space-y-4">
          {/*Main post*/}
          {post && user && (
            <Post
              key={post.id}
              post_id={post.id}
              timePosted={post.created_on}
              message={post.message}
              owner_id={post.owner_id}
              files={post.files}
              avatarUrl={user.avatar}
              onDelete={() => handleDelete(post.id)}
            />
          )}
          {/*Comments*/}
          {comments.posts &&
            comments.posts.map((comment) => (
              <Post
                key={comment.id}
                post_id={comment.id}
                timePosted={comment.created_on}
                message={comment.message}
                owner_id={comment.owner_id}
                files={comment.files}
                avatarUrl={comment.avatarUrl}
                onDelete={() => handleDelete(comment.id)}
              />
            ))}
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
                        // onClick={() => deleteFromUserPosts(index)}
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
                      // onChange={handleFileUpload}
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
                  // onClick={handleSubmit}
                >
                  POST
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
