import React, { useState, useEffect } from "react";
import { ProfileBanner, Post } from "./import";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserByUserName,
  fetchUserPostsByUsername,
} from "../features/User/userSlice";

export default function Profilefeed({ username, description }) {
  const [posts, setPosts] = useState([]);
  const [replies, setReplies] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [articles, setArticles] = useState([]);
  const [media, setMedia] = useState([]);
  const [likes, setLikes] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const userPosts = useSelector((state) => state.user.posts);

  useEffect(() => {
    dispatch(fetchUserByUserName(username));
    dispatch(fetchUserPostsByUsername(username));
  }, []);

  const handleDelete = () => {};
  console.log(user, userPosts);
  return (
    <div>
      <ProfileBanner username={username} />
      {userPosts &&
        user &&
        userPosts.map((post) => (
          <Post
            key={post.id}
            username={post.username}
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
