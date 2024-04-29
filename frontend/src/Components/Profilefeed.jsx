import React, { useEffect, useState } from "react";
import { ProfileBanner, Post } from "./import";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserByUserName } from "../features/User/userSlice";
import {
  fetchUserCommentByUsername,
  fetchUserPostsByUsername,
  fetchUserRepostsByUsername,
  fetchUserLikedPosts,
} from "../features/Post/postSlice";

export default function Profilefeed({ username }) {
  const userDataLocalStorage = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const error = useSelector((state) => state.user.error);
  const userPosts = useSelector((state) => state.post.posts);
  const userReplies = useSelector((state) => state.post.comments);
  const userReposts = useSelector((state) => state.post.reposts);
  const userLikes = useSelector((state) => state.post.likedPosts);

  const [visible, setVisible] = useState({
    posts: true,
    replies: false,
    media: false,
    likes: false,
  });

  useEffect(() => {
    dispatch(fetchUserByUserName(username));
    dispatch(fetchUserPostsByUsername(username));
    dispatch(fetchUserCommentByUsername(username));
    dispatch(fetchUserRepostsByUsername(username));
    dispatch(fetchUserLikedPosts(username));
  }, []);

  const handleDelete = () => {};
  const handleLike = () => {};

  if (error) {
    return <div>{error}</div>;
  }
  if (!user) {
    return <div>Loading...</div>;
  }
  console.log(visible);
  return (
    <div>
      <ProfileBanner
        username={username}
        avatarUrl={user.avatar}
        nickname={user.nickname}
        description={user.description}
        bannerUrl={user.banner}
        onVisibilityChange={(newVisible) => {
          setVisible(newVisible);
        }}
        usersProfile={
          true ? userDataLocalStorage.username === user.username : false
        }
      />
      {visible.posts &&
        userPosts &&
        user &&
        userPosts.map((post) => (
          <Post
            key={post.id}
            amountOfComments={post.amountOfComments}
            amountOfLikes={post.amountOfLikes}
            username={post.username}
            nickname={user.nickname}
            post_id={post.id}
            timePosted={post.created_on}
            message={post.message}
            owner_id={post.owner_id}
            files={post.files}
            avatarUrl={user.avatar}
            onDelete={() => handleDelete(post.id)}
            likePost={() => handleLike(post.id)}
          />
        ))}

      {visible.replies &&
        userReplies &&
        user &&
        userReplies.map((post) => (
          <Post
            key={post.id}
            amountOfComments={post.amountOfComments}
            amountOfLikes={post.amountOfLikes}
            username={post.username}
            nickname={user.nickname}
            post_id={post.id}
            timePosted={post.created_on}
            message={post.message}
            owner_id={post.owner_id}
            files={post.files}
            avatarUrl={user.avatar}
            onDelete={() => handleDelete(post.id)}
            likePost={() => handleLike(post.id)}
          />
        ))}

      {visible.reposts &&
        userReposts &&
        user &&
        userReposts.map((post) => (
          <Post
            key={post.id}
            amountOfComments={post.amountOfComments}
            amountOfLikes={post.amountOfLikes}
            username={post.username}
            nickname={user.nickname}
            post_id={post.id}
            timePosted={post.created_on}
            message={post.message}
            owner_id={post.owner_id}
            files={post.files}
            avatarUrl={user.avatar}
            onDelete={() => handleDelete(post.id)}
            likePost={() => handleLike(post.id)}
          />
        ))}

      {visible.likes &&
        userLikes &&
        user &&
        userLikes.map((post) => (
          <Post
            key={post.id}
            amountOfComments={post.amountOfComments}
            amountOfLikes={post.amountOfLikes}
            username={post.username}
            nickname={user.nickname}
            post_id={post.id}
            timePosted={post.created_on}
            message={post.message}
            owner_id={post.owner_id}
            files={post.files}
            avatarUrl={user.avatar}
            onDelete={() => handleDelete(post.id)}
            likePost={() => handleLike(post.id)}
          />
        ))}
    </div>
  );
}
