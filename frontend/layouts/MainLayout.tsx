import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SidebarMenu from "@/components/sidebar/Sidebar";
import React from "react";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <div className="h-32"></div>
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;
