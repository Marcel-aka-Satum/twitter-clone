import React from "react";

export default function Post() {
  return (
    <div className="flex items-start space-x-4 p-4 border-b border-gray-500">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl">
          A
        </div>
      </div>
      <div className="flex-grow">
        <div className="flex justify-between">
          <div>
            <span className="font-bold text-red-500">Username</span>
            <span className="text-gray-500 ml-2">@username</span>
          </div>
          <div className="text-gray-500">4h</div>
        </div>
        <p className="mt-2 text-red-500">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nisl
          eros, pulvinar facilisis justo mollis, auctor consequat urna.
        </p>
      </div>
    </div>
  );
}
