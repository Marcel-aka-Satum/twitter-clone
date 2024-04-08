import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Post } from "./import";

export default function Home() {
  const [message, setMessage] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  let userDataLocalStorage = JSON.parse(window.localStorage.getItem("user"));
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
      .then((data) => {
        setUserPosts([...userPosts, data]);
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
      {/*left navbar */}
      <div className="flex flex-col ml-[40.33%] justify-between">
        <div className="flex flex-col items-center justify-center text-white h-[50%] gap-3">
          <Link to="/" className="flex items-center mb-4">
            <i className="fas fa-home fa-2x mr-2"></i>
            <span>Home</span>
          </Link>
          <Link to="/Search" className="flex items-center mb-4">
            <i className="fas fa-search fa-2x mr-2"></i>
            <span>Search</span>
          </Link>
          <Link to="/Notifications" className="flex items-center mb-4">
            <i className="fas fa-bell fa-2x mr-2"></i>
            <span>Notifications</span>
          </Link>
          <Link to="/Email" className="flex items-center mb-4">
            <i className="fas fa-envelope fa-2x mr-2"></i>
            <span>Email</span>
          </Link>
          <Link to="/List" className="flex items-center mb-4">
            <i className="fas fa-list fa-2x mr-2"></i>
            <span>List</span>
          </Link>
          <Link to="/Bookmark" className="flex items-center mb-4">
            <i className="fas fa-bookmark fa-2x mr-2"></i>
            <span>Bookmark</span>
          </Link>
          <Link to="/Twitter" className="flex items-center mb-4">
            <i className="fas fa-square-twitter fa-2x mr-2"></i>
            <span>Twitter</span>
          </Link>
          <Link to="/User" className="flex items-center mb-4">
            <i className="fas fa-user fa-2x mr-2"></i>
            <span>User</span>
          </Link>
        </div>
        <div>
          <Link to="/Settings" className="flex items-center mb-4">
            <i className="fas fa-cog fa-2x mr-2"></i>
            <span>Settings</span>
          </Link>
        </div>
      </div>
      {/*middle homepage */}
      <div className="border border-gray-500">
        <div className="flex items-center justify-center mb-4 text-gray-500 ">
          <span className="font-bold flex-1 text-lg ">For you</span>
          <span className="font-bold flex-1 text-lg">Following</span>
        </div>
        <div className="grid grid-cols-3 border border-gray-500 py-2 mb-4 w-full">
          <div className="user-avatar col-span-1 text-red-500">avatar</div>
          <div className="grid grid-col-2 post-message-input col-span-2">
            <div>
              <textarea
                className="h-20 col-span-2 w-full"
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
                timePosted={post.timePosted}
                message={post.message}
              />
            ))}
        </div>
      </div>

      {/*right side */}
      <div className="flex flex-col space-y-4  mr-[40.33%] p-4">
        <input
          className="p-2 border rounded"
          type="text"
          placeholder="Search Twitter"
        />
        <div className="bg-gray-400 p-2 rounded">
          <h2 className="font-bold">Subscribe to Premium</h2>
          <p>
            Subscribe to unlock new features and if eligible, receive a share of
            ads revenue.
          </p>
        </div>
        <div className="bg-gray-400 p-2 rounded">
          <h2 className="font-bold">You might like</h2>
          <ul>
            <li>User 1</li>
            <li>User 2</li>
            <li>User 3</li>
          </ul>
        </div>
        <div className="bg-gray-400 p-2 rounded">
          <h2 className="font-bold">Trends for you</h2>
          <ul>
            <li>Trend 1</li>
            <li>Trend 2</li>
            <li>Trend 3</li>
            <li>Trend 4</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
