import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginAsync, validateUser } from "../features/User/userSlice";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const error = useSelector((state) => state.user.error);

  useEffect(() => {
    const authenticated = dispatch(validateUser());
    if (authenticated.fullfilled) {
      window.location.href = "/";
    }
  }, []);
  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    dispatch(loginAsync(formData));
  };

  return (
    <>
      <div className="bg-[#989696] h-screen flex justify-center items-center">
        <div className="container bg-white flex flex-col w-96 p-8 rounded h-3/7 justify-between items-center">
          <h2 className="text-black font-bold">log in</h2>
          {error && <p className="text-red-500">Invalid credentials</p>}

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
