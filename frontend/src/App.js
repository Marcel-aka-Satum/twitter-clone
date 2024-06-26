import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Home,
  Register,
  Login,
  Profile,
  Settings,
  ProtectedRoute,
  StatusPost,
} from "./Components/import";
import "react-widgets/styles.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* The ProtectedRoute component is a custom component that checks if the user is authenticated. 
        If the user is not authenticated, the user is redirected to the login page. */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/:username/status/:postid" element={<StatusPost />} />
        </Route>
        {/* The Register and Login components are public routes. */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
