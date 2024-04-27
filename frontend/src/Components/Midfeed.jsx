import React, { useEffect } from "react";
import { useColorMode } from "@chakra-ui/react";
import { Post, TextArea } from "./import";
import { useSelector, useDispatch } from "react-redux";
import {
  validateUser,
  fetchUserById,
  repostPost,
} from "../features/User/userSlice";

import { fetchUserPosts, deleteUserPost } from "../features/Post/postSlice";

export default function Midfeed() {
  let userDataLocalStorage = JSON.parse(window.localStorage.getItem("user"));
  let posts = useSelector((state) => state.post.posts);
  const dispatch = useDispatch();
  const { colorMode, toggleColorMode } = useColorMode();

  const changeColor = () => {
    if (colorMode === "dark") {
      // If the current color mode is dark, switch to system color mode
      const systemColorMode = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "system";
      toggleColorMode(systemColorMode);
    } else {
      // If the current color mode is not dark, switch to dark mode
      toggleColorMode("dark");
    }
  };

  useEffect(() => {
    if (userDataLocalStorage) {
      dispatch(fetchUserById(userDataLocalStorage.id));
      dispatch(fetchUserPosts(userDataLocalStorage.id));
    }
    dispatch(validateUser());
  }, []);

  const handleDelete = (post_id) => {
    dispatch(deleteUserPost(post_id));
  };

  const handleRepost = (username, post_id) => {
    dispatch(repostPost({ username: username, post_id: post_id }));
  };

  return (
    <div className="overflow-auto min-w-[300px]">
      <div className="flex border-t border-gray-500 items-center justify-center mb-4 text-gray-500 ">
        <span className="font-bold flex-1 text-lg ">For you</span>
        <span className="font-bold flex-1 text-lg">Following</span>
        <button onClick={changeColor}>change color</button>
      </div>

      <TextArea isComment={false} />

      <div className="space-y-4">
        {posts &&
          (() => {
            let postsReversed = [];
            for (let i = posts.length - 1; i >= 0; i--) {
              console.log(posts[i]);
              postsReversed.push(
                <Post
                  key={posts[i].id}
                  nickname={posts[i].nickname}
                  username={posts[i].username}
                  amountOfComments={posts[i].amountOfComments}
                  amountOfLikes={posts[i].amountOfLikes}
                  amountOfReposts={posts[i].amountOfReposts}
                  post_id={posts[i].id}
                  timePosted={posts[i].created_on}
                  message={posts[i].message}
                  owner_id={posts[i].owner_id}
                  files={posts[i].files}
                  avatarUrl={userDataLocalStorage.avatar}
                  onRepost={() =>
                    handleRepost(userDataLocalStorage.username, posts[i].id)
                  }
                  onDelete={() => handleDelete(posts[i].id)}
                />
              );
            }
            return postsReversed;
          })()}
      </div>
    </div>
  );
}
