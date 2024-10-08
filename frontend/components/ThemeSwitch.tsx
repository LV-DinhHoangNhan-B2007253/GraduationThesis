"use client";

import { Switch } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon } from "./SunIcon";
import { MoonIcon } from "./MoonIcon";

function ThemeSwitch() {
  const [mounted, setMounted] = useState<boolean>(false);
  const { setTheme, resolvedTheme } = useTheme();

  const handleSetTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <></>;
  }
  return (
    <Switch
      size="md"
      color="default"
      onClick={handleSetTheme}
      thumbIcon={() => (resolvedTheme === "light" ? <SunIcon /> : <MoonIcon />)}
    ></Switch>
  );
}

export default ThemeSwitch;
