import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <div className="mt-2">{children}</div>
      <Footer />
    </div>
  );
}

export default MainLayout;
