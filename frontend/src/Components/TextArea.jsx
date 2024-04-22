import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faSmile, faClock } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createComment } from "../features/Post/postSlice";
import { UserAvatarIcon } from "./import";

export default function TextArea({ post_id }) {
  const userDataLocalStorage = JSON.parse(localStorage.getItem("user"));
  const [message, setMessage] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredSmile, setIsHoveredSmile] = useState(false);
  const [isHoveredSchedule, setIsHoveredSchedule] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    const date = new Date().toISOString();
    const formData = new FormData();
    formData.append("message", message);
    formData.append("parent_id", post_id);
    formData.append("owner_id", userDataLocalStorage.id);
    formData.append("created_on", date);
    if (uploadFiles) {
      uploadFiles.forEach((file, index) => {
        formData.append("files", file);
      });
    }
    setMessage("");
    setUploadFiles([]);
    dispatch(createComment(formData));
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
    <div className="flex flex-row py-2 mb-4 w-full">
      <div className="user-avatar ml-2 mt-3">
        {userDataLocalStorage && userDataLocalStorage.avatar && (
          <UserAvatarIcon avatarUrl={userDataLocalStorage.avatar} />
        )}
      </div>
      <div className="text-white p-4 grow">
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
  );
}
