import React, { useState, useEffect, useRef } from "react";
import { UserAvatarIcon } from "./import";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faRetweet,
  faHeart,
  faChartBar,
  faBookmark,
  faShareSquare,
} from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow, parseISO, format } from "date-fns";
import { Link } from "react-router-dom";

export default function Post(props) {
  const owner_id = props.owner_id;
  const [userData, setUserData] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const buttonRef = useRef(null);
  function formatTimePosted(timePosted) {
    if (!timePosted) {
      return;
    }
    const date = parseISO(timePosted);
    const now = new Date();
    const oneDayAgo = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1
    );

    if (date > oneDayAgo) {
      // If the post was made less than a week ago, display the time relative to now (e.g., "5 hours ago").
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      // If the post was made more than a week ago, display the date it was posted (e.g., "April 5").
      return format(date, "MMMM d");
    }
  }

  useEffect(() => {
    if (owner_id === undefined) return;
    fetch(`http://localhost:8000/api/v1/user/${owner_id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <>
      <Link to={`/${props.username}/status/${props.post_id}`}></Link>
      <div className="flex items-start space-x-3 p-2 border-b border-gray-500">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl">
            {userData && <UserAvatarIcon avatarUrl={userData.avatar} />}
          </div>
        </div>
        <div className="flex flex-col flex-grow">
          <div className="flex flex-row text-gray-500 ml-1 justify-between relative">
            <div>
              <span className="font-bold text-red-500">
                {userData.username}
              </span>
              {/**this is gonna be a nickname */}
              <span className="text-gray-500 ml-2">@{userData.username}</span>
              {" ~ " + formatTimePosted(props.timePosted)}
            </div>

            <button
              ref={buttonRef}
              onClick={() => {
                setShowOptions(!showOptions);
              }}
            >
              <span>...</span>
            </button>

            {showOptions && (
              <div className="bg-gray-300 text-black p-2 absolute rounded right-5">
                <button
                  id="showboxOptionButton"
                  onClick={() => props.onDelete(props.post_id)}
                >
                  Delete Post
                </button>
              </div>
            )}
          </div>

          <div>
            {props.files && (
              <div className="flex flex-row gap-2">
                {props.files.map((file, index) => {
                  const fileExtension = file.split(".").pop();
                  if (fileExtension) {
                    // for now u can only upload images later videos
                    return (
                      <img
                        key={index}
                        src={"http://localhost:8000/" + file}
                        alt="post"
                        className="w-36 h-36 object-cover"
                      />
                    );
                  } else {
                    // Handle other file types here (e.g., videos).
                  }
                })}
              </div>
            )}
            <p className="mt-2 text-red-500">{props.message}</p>
          </div>
          <div className="flex flex-row gap-32 text-red-500 mt-2">
            <FontAwesomeIcon icon={faComment} className="cursor-pointer" />
            <FontAwesomeIcon icon={faRetweet} className="cursor-pointer" />
            <FontAwesomeIcon icon={faHeart} className="cursor-pointer" />
            <FontAwesomeIcon icon={faChartBar} className="cursor-pointer" />
            <FontAwesomeIcon icon={faShareSquare} className="cursor-pointer" />
          </div>
        </div>
      </div>
    </>
  );
}
