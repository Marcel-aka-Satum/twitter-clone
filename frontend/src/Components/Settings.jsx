import React, { useState } from "react";

export default function Settings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);

  const handleAvatarChange = (event) => {
    setAvatar(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="mb-4">Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex flex-col">
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-2 py-1 rounded-md"
          />
        </label>
        <label className="flex flex-col">
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-2 py-1 rounded-md"
          />
        </label>
        <label className="flex flex-col">
          Avatar:
          <input
            type="file"
            onChange={handleAvatarChange}
            className="px-2 py-1 rounded-md"
          />
        </label>
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-white text-red-500"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
