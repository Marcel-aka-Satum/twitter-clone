import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { followUser } from "../features/User/userSlice";
import { useDispatch } from "react-redux";

export default function ProfileBanner({
  username,
  avatarUrl,
  description,
  nickname,
  bannerUrl,
  usersProfile,
  onVisibilityChange,
  isFollowing,
}) {
  const dispatch = useDispatch();
  const authenticated_user = useSelector(
    (state) => state.user.authenticated_user
  );
  const followers = useSelector((state) => state.user.user_followers);

  const [visible, setVisible] = useState({
    posts: true,
    replies: false,
    reposts: false,
    likes: false,
  });

  const handleVisibility = (e) => {
    const name = e.target.innerText.toLowerCase();
    const newVisible = {
      ...visible,
      posts: false,
      replies: false,
      reposts: false,
      likes: false,
      [name]: true,
    };
    setVisible(newVisible);
    onVisibilityChange(newVisible);
  };

  useEffect(() => {}, [followers]);

  const handleFollow = () => {
    dispatch(followUser(username));
  };

  return (
    <div>
      <img
        src={`http://localhost:8000/${bannerUrl}`}
        alt="User Banner"
        className="w-full h-48"
      />

      <div className="flex justify-between w-full px-4">
        <div>
          <img
            src={`http://localhost:8000/${avatarUrl}`}
            alt="User avatar"
            className="relative -top-12 w-24 h-24 rounded-full border"
          />
          <h2 className="-mt-8 text-xl font-bold">{nickname}</h2>
          <h2 className="text-xl font-bold">@{username}</h2>
        </div>
        {usersProfile && (
          <div className="flex items-center">
            <a
              className="bg-black text-white rounded-full px-4 py-2 flex-shrink-0 ml-4"
              href="/settings"
            >
              Edit Profile
            </a>
          </div>
        )}

        {isFollowing && (
          <div className="flex items-center">
            <button
              className="bg-gray-500 text-white rounded-full px-4 py-2 flex-shrink-0 ml-4"
              onClick={handleFollow}
            >
              Unfollow
            </button>
          </div>
        )}

        {!isFollowing && authenticated_user.username !== username && (
          <div className="flex items-center">
            <button
              className="bg-gray-500 text-white rounded-full px-4 py-2 flex-shrink-0 ml-4"
              onClick={handleFollow}
            >
              Follow
            </button>
          </div>
        )}
      </div>

      <div className="px-4">{description}</div>

      {/* Footer */}
      <div className="flex mt-4 justify-around border-t border-b border-gray-500 pt-1">
        <div className="flex flex-col">
          <button className="px-2 py-1" onClick={handleVisibility}>
            Posts
          </button>
          {visible.posts && (
            <div className="w-14 h-1 bg-blue-500 rounded-full"></div>
          )}
        </div>
        <button className="px-2 py-1" onClick={handleVisibility}>
          Replies
          {visible.replies && (
            <div className="w-14 h-1 bg-blue-500 rounded-full"></div>
          )}
        </button>
        <button className="px-2 py-1" onClick={handleVisibility}>
          Reposts
          {visible.reposts && (
            <div className="w-14 h-1 bg-blue-500 rounded-full"></div>
          )}
        </button>
        <button className="px-2 py-1" onClick={handleVisibility}>
          Likes
          {visible.likes && (
            <div className="w-14 h-1 bg-blue-500 rounded-full"></div>
          )}
        </button>
      </div>
    </div>
  );
}
