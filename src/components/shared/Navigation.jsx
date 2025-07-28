"use client";
import { ThemeSwitcher } from "./ThemeSwitcher";

export const Navigation = () => {
  return (
    <nav
      className={`w-full z-[999] fixed flex flex-col justify-start h-fit items-center`}
    >
      <div className="h-16 max-w-[1080px] w-full flex justify-end items-center px-2">
        <ThemeSwitcher />
      </div>
    </nav>
  );
};
