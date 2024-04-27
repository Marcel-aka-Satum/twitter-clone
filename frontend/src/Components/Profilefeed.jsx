import React, { useState, useEffect } from "react";
import { ProfileBanner, Post } from "./import";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserByUserName } from "../features/User/userSlice";
import { fetchUserPostsByUsername } from "../features/Post/postSlice";

export default function Profilefeed({ username, description }) {
  const [posts, setPosts] = useState([]);
  const [replies, setReplies] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [articles, setArticles] = useState([]);
  const [media, setMedia] = useState([]);
  const [likes, setLikes] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const error = useSelector((state) => state.user.error);
  const userPosts = useSelector((state) => state.user.posts);

  useEffect(() => {
    dispatch(fetchUserByUserName(username));
    dispatch(fetchUserPostsByUsername(username));
  }, []);

  const handleDelete = () => {};
  if (error) {
    return <div>{error}</div>;
  }
  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <ProfileBanner
        username={username}
        avatarUrl={user.avatar}
        nickname={user.nickname}
        description={user.description}
        bannerUrl={user.banner}
      />
      {userPosts &&
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
          />
        ))}
    </div>
  );
}
