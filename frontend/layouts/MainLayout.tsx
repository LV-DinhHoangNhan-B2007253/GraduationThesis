"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <main className="">{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;
