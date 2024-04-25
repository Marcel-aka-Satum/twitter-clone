import React, { useEffect, useState } from "react";
import { Post, TextArea } from "./import";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPostById,
  fetchCommentsByPostId,
  deleteComment,
  deleteUserStatusPost,
} from "../features/Post/postSlice";
import { fetchUserByUserName, repostPost } from "../features/User/userSlice";

export default function MidFeedStatus({ post_id, owner_post }) {
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post.post);
  const comments = useSelector((state) => state.post.comments);
  const [user, setUser] = useState(null);
  const postNotFound = useSelector((state) => state.post.postNotFound);
  const userNotFound = useSelector((state) => state.user.error);
  let userDataLocalStorage = JSON.parse(window.localStorage.getItem("user"));

  useEffect(() => {
    dispatch(fetchPostById(post_id));
    dispatch(fetchCommentsByPostId(post_id));
    dispatch(fetchUserByUserName(owner_post))
      .unwrap()
      .then((userData) => setUser(userData))
      .catch((error) => console.error("Failed to fetch user:", error));
  }, []);

  const handleDeletePost = (post_id) => {
    dispatch(deleteUserStatusPost(post_id));
  };
  const handleDeleteComment = (comment_id) => {
    dispatch(deleteComment(comment_id));
  };

  const handleRepost = (username, post_id) => {
    dispatch(repostPost({ username: username, post_id: post_id }));
  };

  if (postNotFound || userNotFound || owner_post !== post.username) {
    return (
      <div className="flex items-center justify-center ">Post not found...</div>
    );
  }
  if (!user || !post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid-item-2 border border-gray-500 overflow-auto">
      <div className="flex items-center justify-center mb-4 text-gray-500">
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
              username={post.username}
              post_id={post.id}
              amountOfComments={post.amountOfComments}
              amountOfLikes={post.amountOfLikes}
              amountOfReposts={post.amountOfReposts}
              timePosted={post.created_on}
              message={post.message}
              owner_id={post.owner_id}
              files={post.files}
              avatarUrl={user.avatar}
              onDelete={() => handleDeletePost(post.id)}
              onRepost={() =>
                handleRepost(userDataLocalStorage.username, post.id)
              }
            />
          )}
          {/*Comments*/}
          {comments &&
            comments.map((comment) => (
              <Post
                key={comment.id}
                post_id={comment.id}
                username={comment.username}
                amountOfComments={comment.amountOfComments}
                amountOfLikes={comment.amountOfLikes}
                amountOfReposts={comment.amountOfReposts}
                timePosted={comment.created_on}
                message={comment.message}
                owner_id={comment.owner_id}
                files={comment.files}
                avatarUrl={comment.avatarUrl}
                onDelete={() => handleDeleteComment(comment.id)}
                onRepost={() =>
                  handleRepost(userDataLocalStorage.username, comment.id)
                }
              />
            ))}
          <TextArea post_id={post_id} />
        </div>
      </div>
    </div>
  );
}
