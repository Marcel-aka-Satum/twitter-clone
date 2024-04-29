import { Link } from "react-router-dom";

export default function LeftNavbar() {
  const handleLogout = async () => {
    const response = await fetch("http://localhost:8000/api/v1/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      window.location.href = "/";
    }
  };

  return (
    <div className="relative ">
      <div className="sticky top-0 ml-[75%]">
        <div className="flex flex-col mt-16 text-white gap-3">
          <Link to="/" className="flex items-center mb-4">
            <i className="fas fa-home fa-2x mr-2"></i>
            <span>Home</span>
          </Link>
          <Link to="/Search" className="flex items-center mb-4">
            <i className="fas fa-search fa-2x mr-2"></i>
            <span>Search</span>
          </Link>
          <Link to="/Notifications" className="flex items-center mb-4">
            <i className="fas fa-bell fa-2x mr-2"></i>
            <span>Notifications</span>
          </Link>
          <Link to="/Email" className="flex items-center mb-4">
            <i className="fas fa-envelope fa-2x mr-2"></i>
            <span>Email</span>
          </Link>
          <Link to="/List" className="flex items-center mb-4">
            <i className="fas fa-list fa-2x mr-2"></i>
            <span>List</span>
          </Link>
          <Link to="/Bookmark" className="flex items-center mb-4">
            <i className="fas fa-bookmark fa-2x mr-2"></i>
            <span>Bookmark</span>
          </Link>
          <Link to="/Twitter" className="flex items-center mb-4">
            <i className="fas fa-square-twitter fa-2x mr-2"></i>
            <span>Twitter</span>
          </Link>
          <Link to="/User" className="flex items-center mb-4">
            <i className="fas fa-user fa-2x mr-2"></i>
            <span>User</span>
          </Link>
          <button className="flex items-center mb-4" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt fa-2x mr-2"></i>
            <span>Logout</span>
          </button>
          <Link to="/Settings" className="flex items-center mb-4">
            <i className="fas fa-cog fa-2x mr-2"></i>
            <span>Settings</span>
          </Link>
        </div>
        <div></div>
      </div>
    </div>
  );
}
