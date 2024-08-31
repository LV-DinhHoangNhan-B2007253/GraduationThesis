"use client";

import ThemeSwitch from "./ThemeSwitch";

function Navbar() {
  return (
    <nav className="dark dark:bg-red-400 bg-white">
      <div className="container mx-auto">this is navbar</div>
      <ThemeSwitch />
    </nav>
  );
}

export default Navbar;
