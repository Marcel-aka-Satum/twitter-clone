import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { validateUser } from "../features/User/userSlice";

export default function StatusPost() {
  const { username, postid } = useParams();
  const dispatch = useDispatch();
  const authenticated = useSelector((state) => state.user.authenticated);

  useEffect(() => {
    dispatch(validateUser());
  }, []);

  if (!authenticated) window.location.href = "/login";

  return <div>StatusPost</div>;
}
