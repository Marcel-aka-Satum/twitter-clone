import React, { useEffect, useState } from "react";
import { ProfileBanner, Post } from "./import";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserByUserName } from "../features/User/userSlice";
import {
  fetchUserCommentByUsername,
  fetchUserPostsByUsername,
  fetchUserRepostsByUsername,
  fetchUserLikedPosts,
  deleteUserPost,
  repostPost,
  likePost,
} from "../features/Post/postSlice";

export default function Profilefeed({ username, authenticated_user }) {
  const userDataLocalStorage = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const error = useSelector((state) => state.user.error);
  const userPosts = useSelector((state) => state.post.posts);
  const userReplies = useSelector((state) => state.post.comments);
  const userReposts = useSelector((state) => state.post.reposts);
  const userLikes = useSelector((state) => state.post.likedPosts);
  const authenticatedUserFollowers = useSelector(
    (state) => state.user.user_followers
  );

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

  const handleDelete = (post_id) => {
    dispatch(deleteUserPost(post_id));
  };

  const handleRepost = (post_id) => {
    dispatch(repostPost({ post_id: post_id }));
  };

  const handleLike = (post_id) => {
    dispatch(likePost(post_id));
  };

  if (error) {
    return <div>{error}</div>;
  }
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ProfileBanner
        isFollowing={authenticatedUserFollowers.some(
          (follow) => follow.username === username
        )}
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
            amountOfReposts={post.amountOfReposts}
            username={post.username}
            nickname={user.nickname}
            post_id={post.id}
            timePosted={post.created_on}
            message={post.message}
            owner_id={post.owner_id}
            files={post.files}
            avatarUrl={user.avatar}
            onDelete={() => handleDelete(post.id)}
            handleLike={() => handleLike(post.id)}
            onRepost={() => handleRepost(post.id)}
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
            amountOfReposts={post.amountOfReposts}
            username={post.username}
            nickname={user.nickname}
            post_id={post.id}
            timePosted={post.created_on}
            message={post.message}
            owner_id={post.owner_id}
            files={post.files}
            avatarUrl={user.avatar}
            onDelete={() => handleDelete(post.id)}
            handleLike={() => handleLike(post.id)}
            onRepost={() => handleRepost(post.id)}
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
            amountOfReposts={post.amountOfReposts}
            username={post.username}
            nickname={user.nickname}
            post_id={post.id}
            timePosted={post.created_on}
            message={post.message}
            owner_id={post.owner_id}
            files={post.files}
            avatarUrl={user.avatar}
            onDelete={() => handleDelete(post.id)}
            handleLike={() => handleLike(post.id)}
            onRepost={() => handleRepost(post.id)}
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
            amountOfReposts={post.amountOfReposts}
            username={post.username}
            nickname={user.nickname}
            post_id={post.id}
            timePosted={post.created_on}
            message={post.message}
            owner_id={post.owner_id}
            files={post.files}
            avatarUrl={user.avatar}
            onDelete={() => handleDelete(post.id)}
            handleLike={() => handleLike(post.id)}
            onRepost={() => handleRepost(post.id)}
          />
        ))}
    </div>
  );
}
