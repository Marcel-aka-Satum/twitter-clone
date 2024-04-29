import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerAsync, validateUser } from "../../features/User/userSlice";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [badPassword, setBadPassword] = useState(false);
  const [badUsername, setBadUsername] = useState(false);
  const [badEmail, setBadEmail] = useState(false);
  const [samePassword, setSamePassword] = useState(false);

  const dispatch = useDispatch();
  const authenticated = useSelector((state) => state.user.authenticated);
  const error = useSelector((state) => state.user.error);

  useEffect(() => {
    dispatch(validateUser());
  }, []);

  function isPasswordStrong(str) {
    // Check for uppercase, lowercase, number, and special character
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(str);
  }

  if (authenticated) {
    window.location.href = "/";
  }
  const handleRegister = (e) => {
    e.preventDefault();
    setBadPassword(false);
    setBadUsername(false);
    setBadEmail(false);
    setSamePassword(false);

    if (password !== confirmPassword) {
      setSamePassword(true);
      return;
    }
    if (!isPasswordStrong(password)) {
      console.log("bad password", password, isPasswordStrong(password));
      setBadPassword(true);
      return;
    }
    if (username.length < 3 || username.length > 20 || username.length === 0) {
      setBadUsername(true);
      return;
    }
    if (
      (email.length < 3 && !email.includes("@") && !email.includes(".")) ||
      email.length === 0
    ) {
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
          {badPassword && (
            <p className="text-red-500">
              Password not secure enough! (Password needs 1 uppercase letter, 1
              lowercase letter 1 normal letter, 1 special character and 1 number
              and be at least 8 characters long)
            </p>
          )}
          {badUsername && <p className="text-red-500">Invalid username</p>}
          {badEmail && <p className="text-red-500">Invalid email</p>}
          {samePassword && (
            <p className="text-red-500">Passwords do not match</p>
          )}
          {error && <p className="text-red-500">{error}</p>}
          <form className="flex-col items-center" onSubmit={handleRegister}>
            <input
              className="p-3 border rounded mt-2 w-full"
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
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
              maxLength={128}
            />

            <input
              className="p-3 border rounded mt-2 w-full"
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              maxLength={128}
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
