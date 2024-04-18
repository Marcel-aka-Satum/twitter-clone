import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { registerAsync, validateUser } from "../features/User/userSlice";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [badPassword, setBadPassword] = useState(false);
  const [badUsername, setBadUsername] = useState(false);
  const [badEmail, setBadEmail] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const authenticated = dispatch(validateUser());
    if (authenticated.fullfilled) {
      window.location.href = "/";
    }
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setBadPassword(true);
      return;
    }
    if (username.length < 3 || username.length > 20) {
      setBadUsername(true);
      return;
    }
    if (email.length < 3 && !email.includes("@") && !email.includes(".")) {
      setBadEmail(true);
      return;
    }

    dispatch(
      registerAsync({ username: username, email: email, password: password })
    );
  };

  return (
    <>
      <div className="bg-[#989696] h-screen flex justify-center items-center">
        <div className="container bg-white flex flex-col w-96 p-8 rounded h-3/7 justify-between items-center">
          <h2 className="text-black font-bold">Make an account</h2>

          <form className="flex-col items-center" onSubmit={handleRegister}>
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

            <button className="bg-white text-blue-500 p-2 border rounded mt-5">
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
