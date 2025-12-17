import { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="layout">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="content flex min-h-screen flex-1 flex-col">
        <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
