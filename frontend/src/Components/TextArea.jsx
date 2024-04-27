import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faSmile, faClock } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createComment } from "../features/Post/postSlice";
import { UserAvatarIcon } from "./import";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import DatePicker from "react-widgets/DatePicker";
import TimeInput from "react-widgets/TimeInput";
import { createPost } from "../features/Post/postSlice";

export default function TextArea({ post_id, isComment }) {
  let userDataLocalStorage = JSON.parse(window.localStorage.getItem("user"));
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredSmile, setIsHoveredSmile] = useState(false);
  const [isHoveredSchedule, setIsHoveredSchedule] = useState(false);
  const [fileLarge, setFileLarge] = useState(false);
  const [wrongTypeFile, setWrongTypeFile] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [requestedDate, setRequestedDate] = useState(null);
  const [humanReadableDate, setHumanReadableDate] = useState(null);
  let scheduled = useSelector((state) => state.user.scheduled);
  let scheduledError = useSelector((state) => state.user.scheduledError);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      toHumanReadable();
    }
  }, [selectedDate, selectedTime]);

  const toHumanReadable = () => {
    let humanReadableDateArgument = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      selectedTime.getHours(),
      selectedTime.getMinutes()
    );
    setHumanReadableDate(humanReadableDateArgument);
    setRequestedDate(humanReadableDateArgument.toISOString());
  };

  const cancelScheduling = () => {
    setSelectedDate(null);
    setSelectedTime(null);
    setShowScheduler(false);
    setRequestedDate(null);
  };

  const emojiMenu = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const schedulePost = () => {
    setShowScheduler(!showScheduler);
  };

  const handleSubmit = () => {
    const date = new Date().toISOString();
    const formData = new FormData();
    formData.append("message", message);
    formData.append("owner_id", userDataLocalStorage.id);
    formData.append("created_on", date);
    if (isComment) {
      formData.append("parent_id", post_id);
    }
    if (uploadFiles) {
      uploadFiles.forEach((file, index) => {
        formData.append("files", file);
      });
    }
    if (requestedDate) {
      formData.append("scheduled_time", requestedDate);
    }
    if (isComment) {
      dispatch(createComment(formData));
    } else {
      dispatch(createPost(formData));
    }
    setMessage("");
    setUploadFiles([]);
    cancelScheduling();
  };

  const handleFileUpload = (event) => {
    const newFilesArr = [];
    setFileLarge(false);
    setWrongTypeFile(false);
    for (let i = 0; i < event.target.files.length; i++) {
      if (event.target.files[i].size > 5000000) {
        setFileLarge(true);
        return;
      }
      if (
        event.target.files[i].type !== "image/jpeg" &&
        event.target.files[i].type !== "image/png" &&
        event.target.files[i].type !== "image/gif" &&
        event.target.files[i].type !== "image/jif" &&
        event.target.files[i].type !== "application/pdf"
      ) {
        setWrongTypeFile(true);
        return;
      }
      newFilesArr.push(event.target.files[i]);
    }
    setUploadFiles(newFilesArr);
  };

  const deleteFromUserPosts = (index) => {
    const newUploadFiles = uploadFiles.filter((file, i) => i !== index);
    setUploadFiles(newUploadFiles);
  };

  return (
    <div className="flex flex-row py-2 mb-4 w-full border-b border-gray-500">
      <div className="user-avatar ml-2 mt-3">
        {userDataLocalStorage && userDataLocalStorage.avatar && (
          <UserAvatarIcon avatarUrl={userDataLocalStorage.avatar} />
        )}
      </div>

      <div className="text-white p-4 grow">
        {scheduled && (
          <p className="text-green-500">Post has been succesfully scheduled!</p>
        )}
        {scheduledError && (
          <p className="text-red-500">
            Post could not be scheduled, try later!
          </p>
        )}
        <textarea
          className="w-full h-32 bg-gray-800 text-white p-2 mb-4"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        {uploadFiles && uploadFiles.length > 0 ? (
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
          ))
        ) : (
          <p className="text-gray-500 text-sm">
            Files supported: -jpg -png, -gif, -jif, -pdf.
          </p>
        )}
        {!isComment && selectedDate && selectedTime && (
          <>
            <p className="text-red-500">
              Ur post will be scheduled at:{" "}
              {humanReadableDate &&
                new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }).format(humanReadableDate)}
              <button className="ml-5 text-white" onClick={cancelScheduling}>
                X
              </button>
            </p>
          </>
        )}

        {fileLarge && <p className="text-red-500">File size is too large</p>}
        {wrongTypeFile && (
          <p className="text-red-500">File type is not supported</p>
        )}

        {!isComment && showScheduler && (
          <div className="flex p-1">
            <DatePicker
              className="w-2/5"
              placeholder="dd/m/yy"
              onChange={(date) => setSelectedDate(date)}
            />
            <TimeInput
              className="w-2/5 mt-0 ml-2"
              use12HourClock
              onChange={(time) => setSelectedTime(time)}
            />
          </div>
        )}

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
            <div className="relative">
              <button onClick={emojiMenu}>
                <FontAwesomeIcon
                  icon={faSmile}
                  className={`text-blue-500 cursor-pointer ${
                    isHoveredSmile ? "border-2 border-blue-500 rounded" : ""
                  }`}
                  onMouseEnter={() => setIsHoveredSmile(true)}
                  onMouseLeave={() => setIsHoveredSmile(false)}
                />
                {showEmojiPicker && (
                  <Picker
                    className="absolute bottom-14"
                    data={data}
                    onEmojiSelect={(data) => {
                      setMessage(message + data.native);
                    }}
                  />
                )}
              </button>
            </div>
            {!isComment && (
              <div>
                <button onClick={schedulePost}>
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
                </button>
              </div>
            )}
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
