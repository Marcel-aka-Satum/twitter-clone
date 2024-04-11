import React, { useState, useEffect } from "react";
import { Post, LeftNavbar, RightNavbar } from "./import";

export default function Home() {
  const [message, setMessage] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  let userDataLocalStorage = JSON.parse(window.localStorage.getItem("user"));

  const handlePostDelete = (postId) => {
    setUserPosts(userPosts.filter((post) => post.id !== postId));
  };

  const handleSubmit = () => {
    const date = new Date().toISOString();
    const data = {
      message: message,
      owner_id: userDataLocalStorage.id,
      created_on: date,
    };

    fetch("http://localhost:8000/api/v1/post", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        setUserPosts([...userPosts, responseData]);
        setMessage(""); // Clear the textarea
      })
      .catch((error) => console.error("Error:", error));
  };
  useEffect(() => {
    if (userDataLocalStorage) {
      fetch(
        `http://localhost:8000/api/v1/users/post/${userDataLocalStorage.id}`
      )
        .then((res) => res.json())
        .then((data) => {
          setUserPosts(data["posts"]);
        })
        .catch((error) => console.error("Error fetching posts:", error));
    }
  }, []);

  return (
    <div className="grid grid-cols-3 w-screen h-screen justify-center">
      <LeftNavbar />
      {/*middle homepage */}
      <div className="border border-gray-500">
        <div className="flex items-center justify-center mb-4 text-gray-500 ">
          <span className="font-bold flex-1 text-lg ">For you</span>
          <span className="font-bold flex-1 text-lg">Following</span>
        </div>

        <div className="flex flex-row border border-gray-500 py-2 mb-4 w-full">
          <div className="user-avatar text-red-500">avatar</div>
          <div className="flex flex-col flex-grow">
            <div>
              <textarea
                value={message}
                className="h-20  w-full"
                placeholder="What's happening?"
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            <div className="files-under-post text-red-500">
              <button
                className="post-button text-white bg-blue-500 rounded"
                onClick={handleSubmit}
              >
                {" "}
                Post{" "}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Replace this with your posts */}
          {userPosts &&
            userPosts.map((post) => (
              <Post
                key={post.id}
                post_id={post.id}
                timePosted={post.created_on}
                message={post.message}
                owner_id={post.owner_id}
                onDelete={handlePostDelete}
              />
            ))}
        </div>
      </div>
      <RightNavbar />
    </div>
  );
}
