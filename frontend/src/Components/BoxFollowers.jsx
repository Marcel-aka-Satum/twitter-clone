import React from "react";

export default function BoxFollowers(props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="bg-[#272423] p-8 rounded-lg shadow-lg relative z-10 max-w-md mx-auto">
        <button
          className="absolute top-0 right-0 m-2"
          onClick={() => props.setShowBoxFollowing(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="flex flex-col">
          {props.arrFollowing.length === 0 && (
            <span className="text-center">No associated followers yet</span>
          )}
          {props.arrFollowing.map((user) => (
            <div key={user.username}>
              <a href={`/profile/${user.username}`} className="flex flex-row">
                <img
                  src={`http://localhost:8000/${user.avatar}`}
                  className="w-12 h-12 rounded-full border"
                  alt="avatar"
                />{" "}
                <span className="ml-4 mt-4">@{user.username}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
