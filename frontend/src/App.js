import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home, Register, Login, User, Settings } from "./Components/import";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile/:username" element={<User />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
