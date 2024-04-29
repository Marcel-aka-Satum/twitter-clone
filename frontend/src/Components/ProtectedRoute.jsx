import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserById, validateUser } from "../features/User/userSlice";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  let authenticated = useSelector((state) => state.user.authenticated);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(validateUser()).then((action) => {
      setLoading(false);
      if (validateUser.fulfilled.match(action)) {
        dispatch(fetchUserById(action.payload.user_id));
      }
    });
  }, []);

  if (loading) {
    return null; // or return a loading spinner
  }

  return authenticated ? <Outlet /> : <Navigate to="/login" replace={true} />;
}
