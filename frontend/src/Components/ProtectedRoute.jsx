import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUser,
  validateUser,
  fetchUserLikes,
  fetchUserReposts,
  fetchUserFollowers,
} from "../features/User/userSlice";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  let authenticated = useSelector((state) => state.user.authenticated);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(validateUser()).then((action) => {
      setLoading(false);
      if (validateUser.fulfilled.match(action)) {
        dispatch(fetchUser());
        dispatch(fetchUserLikes());
        dispatch(fetchUserReposts());
        dispatch(fetchUserFollowers());
      }
    });
  }, []);

  if (loading) {
    return null; // or return a loading spinner
  }

  return authenticated ? <Outlet /> : <Navigate to="/login" replace={true} />;
}
