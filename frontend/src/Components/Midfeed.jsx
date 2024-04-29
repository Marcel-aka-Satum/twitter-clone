import React, { useEffect } from "react";
import { Post, TextArea } from "./import";
import { useSelector, useDispatch } from "react-redux";
import { validateUser, fetchUser } from "../features/User/userSlice";
import {
  fetchUserPosts,
  deleteUserPost,
  likePost,
  repostPost,
} from "../features/Post/postSlice";
import { fetchPostsGlobal } from "../features/Feed/feedSlice";

export default function Midfeed() {
  let userDataLocalStorage = JSON.parse(window.localStorage.getItem("user"));
  let posts = useSelector((state) => state.post.posts);
  let globalPosts = useSelector((state) => state.feed.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userDataLocalStorage) {
      dispatch(fetchUserPosts(userDataLocalStorage.id));
    }
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

  return (
    <div className="min-w-[300px]">
      <div className="flex border-t border-gray-500 items-center justify-center mb-4 text-gray-500 ">
        <span className="font-bold flex-1 text-lg ">For you</span>
        <span className="font-bold flex-1 text-lg">Following</span>
      </div>

      <TextArea isComment={false} />

      <div className="space-y-4">
        {globalPosts &&
          (() => {
            let postsReversed = [];
            for (let i = globalPosts.length - 1; i >= 0; i--) {
              postsReversed.push(
                <Post
                  key={globalPosts[i].id}
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
                />
              );
            }
            return postsReversed;
          })()}
      </div>
    </div>
  );
}
