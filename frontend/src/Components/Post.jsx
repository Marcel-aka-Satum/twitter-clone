import React, { useState, useEffect, useRef } from "react";
import { UserAvatarIcon } from "./import";
import { formatDistanceToNow, parseISO, format } from "date-fns";

export default function Post(props) {
  const owner_id = props.owner_id;
  const [userData, setUserData] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const buttonRef = useRef(null);

  function formatTimePosted(timePosted) {
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
    fetch(`http://localhost:8000/api/v1/users/${owner_id}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleDelete = () => {
    fetch(`http://localhost:8000/api/v1/post/${props.post_id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status === 200) {
        props.onDelete(props.post_id);
      }
    });
  };

  return (
    <>
      <div className="flex items-start space-x-4 p-4 border-b border-gray-500">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl">
            <UserAvatarIcon />
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
                <button id="showboxOptionButton" onClick={handleDelete}>
                  Delete Post
                </button>
              </div>
            )}
          </div>

          <div>
            <p className="mt-2 text-red-500">{props.message}</p>
          </div>
          <div className="text-red-500">nav1 nav2 nav3</div>
        </div>
      </div>
    </>
  );
}
