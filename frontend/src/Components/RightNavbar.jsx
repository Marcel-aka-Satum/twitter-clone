import React from "react";

export default function RightNavbar() {
  return (
    <div className="flex flex-col space-y-4  mr-[40.33%] p-4 overflow-auto h-full border-l border-gray-500">
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
  );
}
