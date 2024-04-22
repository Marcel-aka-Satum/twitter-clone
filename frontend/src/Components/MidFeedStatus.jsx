import React, { useEffect } from "react";
import { Post, TextArea } from "./import";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPostById,
  fetchCommentsByPostId,
} from "../features/Post/postSlice";
import { fetchUserByUserName } from "../features/User/userSlice";
import { Link } from "react-router-dom";

export default function MidFeedStatus({ post_id, owner_post }) {
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post.post);
  const comments = useSelector((state) => state.post.comments);
  const user = useSelector((state) => state.user.user);
  const postNotFound = useSelector((state) => state.post.postNotFound);

  useEffect(() => {
    dispatch(fetchPostById(post_id));
    dispatch(fetchCommentsByPostId(post_id));
    dispatch(fetchUserByUserName(owner_post));
  }, []);

  const handleDelete = (post_id) => {};
  if (postNotFound) {
    return (
      <div className="flex items-center justify-center ">Post not found...</div>
    );
  }
  return (
    <div className="grid-item-2 border border-gray-500 overflow-auto min-w-[300px]">
      <div className="flex items-center justify-center mb-4 text-gray-500 ">
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
              post_id={post.id}
              timePosted={post.created_on}
              message={post.message}
              owner_id={post.owner_id}
              files={post.files}
              avatarUrl={user.avatar}
              onDelete={() => handleDelete(post.id)}
            />
          )}
          {/*Comments*/}
          {comments &&
            comments.map((comment) => (
              <Post
                key={comment.id}
                post_id={comment.id}
                timePosted={comment.created_on}
                message={comment.message}
                owner_id={comment.owner_id}
                files={comment.files}
                avatarUrl={comment.avatarUrl}
                onDelete={() => handleDelete(comment.id)}
              />
            ))}
          <TextArea post_id={post_id} />
        </div>
      </div>
    </div>
  );
}
