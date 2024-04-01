import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="grid grid-cols-3 w-screen h-screen justify-center gap-1">
      <div className="flex flex-col ml-[40.33%] bg-purple-500 justify-between">
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
      <div className="bg-green-500 p-4">
        <div className="flex justify-between mb-4">
          <span className="font-bold text-lg">For you</span>
          <span className="font-bold text-lg">Following</span>
        </div>
        <div className="border-t border-b py-2 mb-4">
          <textarea
            className="w-full h-20 p-2"
            placeholder="What's happening?"
          ></textarea>
        </div>
        <div className="space-y-4">
          {/* Replace this with your posts */}
          <div className="border-t border-b py-2">
            <p>Post 1</p>
          </div>
          <div className="border-t border-b py-2">
            <p>Post 2</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-4 bg-blue-500 mr-[40.33%] p-4">
        <input
          className="p-2 border rounded"
          type="text"
          placeholder="Search Twitter"
        />
        <div className="bg-gray-200 p-2 rounded">
          <h2 className="font-bold">Subscribe to Premium</h2>
          <p>
            Subscribe to unlock new features and if eligible, receive a share of
            ads revenue.
          </p>
        </div>
        <div className="bg-gray-200 p-2 rounded">
          <h2 className="font-bold">You might like</h2>
          <ul>
            <li>User 1</li>
            <li>User 2</li>
            <li>User 3</li>
          </ul>
        </div>
        <div className="bg-gray-200 p-2 rounded">
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
