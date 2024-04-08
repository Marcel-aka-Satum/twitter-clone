import React, { useState, useEffect } from "react";

export default function Post(props) {
  const owner_id = props.owner_id;
  const [userData, setUserData] = useState({});

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/users/${owner_id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => setUserData(data))
      .catch((error) => console.error("Error:", error));
  }, [owner_id]);

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
            <span className="font-bold text-red-500">{userData.username}</span>
            {/**this is gonna be a nickname */}
            <span className="text-gray-500 ml-2">{userData.username}</span>
          </div>
          <div className="text-gray-500">{props.timePosted}</div>
        </div>
        <p className="mt-2 text-red-500">{props.message}</p>
      </div>
    </div>
  );
}
