import React, { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    fetch("http://localhost:8000/api/v1/token", {
      method: "POST",
      withCredentials: true,
      body: formData,
    });
  };

  return (
    <>
      <div className="bg-[#989696] h-screen flex justify-center items-center">
        <div className="container bg-white flex flex-col w-96 p-8 rounded h-3/7 justify-between items-center">
          <h2 className="text-black font-bold">log in</h2>
          <form className="flex-col items-center">
            <input
              className="p-3 border rounded mt-2 w-full"
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              className="p-3 border rounded mt-2 w-full"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="bg-white text-blue-500 p-2 border rounded mt-5"
              onClick={handleLogin}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
