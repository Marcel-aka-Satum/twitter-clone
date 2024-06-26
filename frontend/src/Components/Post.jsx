import React, { useState, useEffect, useRef } from "react";
import { UserAvatarIcon } from "./import";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faRetweet,
  faHeart,
  faShareSquare,
} from "@fortawesome/free-solid-svg-icons";
import { formatDistanceToNow, parseISO, format } from "date-fns";
import { useSelector } from "react-redux";

export default function Post(props) {
  const [userData, setUserData] = useState({});
  const [showOptions, setShowOptions] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const buttonRef = useRef(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isReposted, setIsReposted] = useState(false);
  const user = useSelector((state) => state.user.user);
  const [likedPosts, setLikedPosts] = useState(
    JSON.parse(localStorage.getItem("likes")) || []
  );
  const [repostedPosts, setRepostedPosts] = useState(
    JSON.parse(localStorage.getItem("reposts")) || []
  );
  useEffect(() => {
    if (likedPosts.includes(props.post_id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
    if (repostedPosts.includes(props.post_id)) {
      setIsReposted(true);
    } else {
      setIsReposted(false);
    }
  }, []);
  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/user/username/${props.username}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error:", error));
  }, []);

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

  const sharePost = (url_info) => {
    setShowShare(true);
    let url_path =
      "http://localhost:3000/" +
      url_info.username +
      "/status/" +
      url_info.post_id;
    navigator.clipboard
      .writeText(url_path)
      .then(() => {
        setTimeout(() => {
          setShowShare(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err);
      });
  };

  const persistLikeState = () => {
    setIsLiked(!isLiked);
  };

  const persistRepostState = () => {
    setIsReposted(!isReposted);
  };

  return (
    <>
      <div className="flex items-start space-x-3 p-2 border-b border-gray-500">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl">
            {userData && (
              <UserAvatarIcon
                avatarUrl={userData.avatar}
                userProfilePath={`/profile/${props.username}`}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col flex-grow">
          <div className="flex flex-row text-gray-500 ml-1 justify-between relative">
            <div>
              <a href={`/profile/${props.username}`}>
                <span className="font-bold text-red-500">
                  {userData.nickname}
                </span>
                <span className="text-gray-500 ml-2">@{userData.username}</span>
              </a>
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
              <>
                <div className="flex flex-col bg-gray-300 text-black p-2 absolute rounded right-5 ">
                  {user.username === props.username && (
                    <div className="transition-colors duration-300 hover:bg-gray-200 ">
                      <button
                        id="showboxOptionButton"
                        className=" border-b border-black"
                        onClick={() => props.onDelete(props.post_id)}
                      >
                        Delete Post
                      </button>
                    </div>
                  )}
                  {user.username !== props.username && !props.isFollowing && (
                    <div className="transition-colors duration-300 hover:bg-gray-200">
                      <button
                        id="showboxOptionButton"
                        className=" border-b border-black"
                        onClick={() => props.onFollow(props.username)}
                      >
                        Follow
                      </button>
                    </div>
                  )}
                  <div className="transition-colors duration-300 hover:bg-gray-200">
                    <a href={`http://localhost:3000/profile/${props.username}`}>
                      View Profile
                    </a>
                  </div>
                </div>
              </>
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
            <a href={`/${props.username}/status/${props.post_id}`}>
              <p className="mt-2 text-red-500">{props.message}</p>
            </a>
          </div>
          <div className="flex flex-row gap-32 text-red-500 mt-2">
            <a href={`/${props.username}/status/${props.post_id}`}>
              <FontAwesomeIcon icon={faComment} className="cursor-pointer" />{" "}
              {props.amountOfComments}
            </a>
            <button
              style={{ color: isReposted && "#f33098" }}
              onClick={() => {
                props.onRepost(props.username, props.post_id);
                persistRepostState();
              }}
            >
              <FontAwesomeIcon icon={faRetweet} className="cursor-pointer" />{" "}
              {props.amountOfReposts}
            </button>

            <button
              style={{ color: isLiked && "#f33098" }}
              onClick={() => {
                props.handleLike();
                persistLikeState();
              }}
            >
              <FontAwesomeIcon icon={faHeart} className="cursor-pointer" />{" "}
              {props.amountOfLikes}
            </button>

            <div>
              <button onClick={() => sharePost(props)}>
                <FontAwesomeIcon
                  icon={faShareSquare}
                  className="cursor-pointer"
                />
              </button>
            </div>
          </div>
          {showShare && (
            <div className="fixed w-44 h-10 inset-x-0 bottom-0 mx-auto mb-4 z-50 bg-blue-500 text-white pt-2 rounded text-center">
              Copied to clipboard
            </div>
          )}
        </div>
      </div>
    </>
  );
}
