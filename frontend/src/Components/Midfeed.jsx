import React, { useEffect, useState } from "react";
import { Post, TextArea } from "./import";
import { useSelector, useDispatch } from "react-redux";
import {
  validateUser,
  fetchUser,
  followUser,
} from "../features/User/userSlice";
import {
  deleteUserPost,
  likePost,
  repostPost,
} from "../features/Post/postSlice";
import { fetchPostsGlobal } from "../features/Feed/feedSlice";

export default function Midfeed() {
  let userDataLocalStorage = JSON.parse(window.localStorage.getItem("user"));
  let globalPosts = useSelector((state) => state.feed.posts);
  let userFollowers = useSelector((state) => state.user.user_followers);
  const [numPostsToShow, setNumPostsToShow] = useState(6);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
    dispatch(validateUser());
    dispatch(fetchPostsGlobal());
  }, []);

  const handleDelete = (post_id) => {
    dispatch(deleteUserPost(post_id));
  };

  const handleRepost = (post_id) => {
    dispatch(repostPost({ post_id: post_id }));
  };

  const handleLike = (post_id) => {
    dispatch(likePost(post_id));
  };

  const handleFollow = (username) => {
    dispatch(followUser(username));
  };

  return (
    <div className="min-w-[300px]">
      <div className="flex border-t border-gray-500 items-center justify-center mb-4 text-gray-500 border-b">
        <span className="font-bold flex-1 text-lg border-r border-gray-500">
          For you
        </span>
        <span className="font-bold flex-1 text-lg">Following</span>
      </div>

      <TextArea isComment={false} />

      <div className="space-y-4">
        {globalPosts &&
          (() => {
            let postsReversed = [];
            for (
              let i = globalPosts.length - 1;
              i >= 0 && i >= globalPosts.length - numPostsToShow;
              i--
            ) {
              let isFollowing = userFollowers.some(
                (user) => user.username === globalPosts[i].username
              );
              postsReversed.push(
                <Post
                  key={globalPosts[i].id}
                  isFollowing={isFollowing}
                  nickname={globalPosts[i].nickname}
                  username={globalPosts[i].username}
                  amountOfComments={globalPosts[i].amountOfComments}
                  amountOfLikes={globalPosts[i].amountOfLikes}
                  amountOfReposts={globalPosts[i].amountOfReposts}
                  post_id={globalPosts[i].id}
                  timePosted={globalPosts[i].created_on}
                  message={globalPosts[i].message}
                  owner_id={globalPosts[i].owner_id}
                  files={globalPosts[i].files}
                  avatarUrl={userDataLocalStorage.avatar}
                  handleLike={() => handleLike(globalPosts[i].id)}
                  onRepost={() => handleRepost(globalPosts[i].id)}
                  onDelete={() => handleDelete(globalPosts[i].id)}
                  onFollow={(username) => handleFollow(username)}
                />
              );
            }
            return (
              <>
                {postsReversed}
                {globalPosts.length > numPostsToShow && (
                  <button
                    className="bg-blue-500 text-white rounded-full py-2 px-4 mx-auto block"
                    onClick={() => setNumPostsToShow(numPostsToShow + 6)}
                  >
                    Load More
                  </button>
                )}
              </>
            );
          })()}
      </div>
    </div>
  );
}
