import React, { useEffect, useState } from "react";
import { Post, TextArea } from "./import";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPostById,
  fetchCommentsByPostId,
  deleteComment,
  deleteUserStatusPost,
} from "../features/Post/postSlice";
import { fetchUserByUserName } from "../features/User/userSlice";
import { repostPost, likePost } from "../features/Post/postSlice";

export default function MidFeedStatus({ post_id, owner_post }) {
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post.post);
  const comments = useSelector((state) => state.post.comments);
  const [user, setUser] = useState(null);
  const postNotFound = useSelector((state) => state.post.postNotFound);
  const userNotFound = useSelector((state) => state.user.error);

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

  const handleRepost = (post_id) => {
    dispatch(repostPost({ post_id: post_id }));
  };

  const handleLike = (post_id) => {
    dispatch(likePost(post_id));
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
    <div className="overflow-auto min-w-[300px]">
      <div className="flex items-center justify-center mb-4 text-gray-500">
        <span className="font-bold flex-1 text-lg ">For you</span>
        <span className="font-bold flex-1 text-lg">Following</span>
        {/* <button onClick={changeColor}>change color</button> */}
      </div>

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
            handleLike={() => handleLike(post.id)}
            onDelete={() => handleDeletePost(post.id)}
            onRepost={() => handleRepost(post.id)}
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
              handleLike={() => handleLike(comment.id)}
              onDelete={() => handleDeleteComment(comment.id)}
              onRepost={() => handleRepost(comment.id)}
            />
          ))}
        <TextArea post_id={post_id} isComment={true} />
      </div>
    </div>
  );
}
