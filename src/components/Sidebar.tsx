import { Home, User, Settings } from "lucide-react";
import { Link } from "react-router-dom";

type SidebarProps = {
  isOpen: boolean;
};

export default function Sidebar({ isOpen }: SidebarProps) {
  return (
    <aside
      className={`sidebar fixed top-0 left-0 z-40 h-full transform bg-white shadow-lg transition-transform md:relative ${
        isOpen ? "translate-x-0" : "sidebar-hidden"
      }`}
    >
      <nav className="flex flex-col space-y-2 p-4">
        <Link
          to="/"
          className="flex items-center space-x-2 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
        >
          <Home size={18} />
          <span>Home</span>
        </Link>
        <Link
          to="/profile"
          className="flex items-center space-x-2 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
        >
          <User size={18} />
          <span>Profile</span>
        </Link>
        <Link
          to="/settings"
          className="flex items-center space-x-2 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
        >
          <Settings size={18} />
          <span>Settings</span>
        </Link>
      </nav>
    </aside>
  );
}
