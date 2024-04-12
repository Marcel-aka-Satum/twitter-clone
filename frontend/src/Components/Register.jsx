import React, { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    fetch("http://localhost:8000/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    });
    window.location.reload();
  };

  return (
    <>
      <div className="bg-[#989696] h-screen flex justify-center items-center">
        <div className="container bg-white flex flex-col w-96 p-8 rounded h-3/7 justify-between items-center">
          <h2 className="text-black font-bold">Make an account</h2>
          <form className="flex-col items-center">
            <input
              className="p-3 border rounded mt-2 w-full"
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              className="p-3 border rounded mt-2 w-full"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="p-3 border rounded mt-2 w-full"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              className="p-3 border rounded mt-2 w-full"
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              className="bg-white text-blue-500 p-2 border rounded mt-5"
              onClick={handleRegister}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
