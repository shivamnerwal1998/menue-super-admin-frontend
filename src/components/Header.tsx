import { useState } from "react";
import { Menu, X } from "lucide-react";

type HeaderProps = {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
};

export default function Header({ toggleSidebar, isSidebarOpen }: HeaderProps) {
  return (
    <header className="flex items-center justify-between bg-white px-4 py-3 shadow-md md:px-6">
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleSidebar}
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100 md:hidden"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <h1 className="text-xl font-bold text-blue-600">MyApp</h1>
      </div>
      <div>
        <button className="rounded-full bg-blue-500 px-3 py-1 text-white hover:bg-blue-600">
          Login
        </button>
      </div>
    </header>
  );
}
