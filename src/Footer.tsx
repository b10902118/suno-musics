"use client";

import { useEffect } from "react";
import { mixClass } from "class-lib";
import {
  ArrowDownTrayIcon,
  Bars3Icon,
  HeartIcon as HeartIconSolid,
  ArrowLongLeftIcon,
} from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { useFooterStore } from "./store";

export default function Footer() {
  const { status, onSL, centerText, onEnter } = useFooterStore();

  // Choose icon based on status
  const SLIcon =
    status === "gallery"
      ? Bars3Icon
      : status === "viewer"
      ? ArrowDownTrayIcon
      : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onSL();
      }
      if (e.key === "Enter") {
        onEnter();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSL, onEnter]);

  return (
    <footer
      dir="ltr"
      className={
        "flex flex-shrink-0 bg-black pointer-events-none box-border w-screen px-1 py-0.5"
      }
    >
      <div
        className="text-white pointer-events-auto flex cursor-pointer items-center justify-center outline-none"
        tabIndex={-1}
      >
        {/* SL */}
        {SLIcon && <SLIcon className="h-6 w-6" onClick={onSL} />}
      </div>
      <div
        className={mixClass(
          "relative grow overflow-hidden whitespace-nowrap text-center font-bold gap-2 flex justify-center items-center"
        )}
      >
        {/* Enter */}
        {status === "viewer" ? (
          <HeartIconOutline className="h-6 w-6 text-white" onClick={onEnter} />
        ) : status === "gallery" ? (
          <span className="text-gray-400">{centerText}</span>
        ) : null}
      </div>
      <div
        className="text-white pointer-events-auto flex cursor-pointer items-center justify-center outline-none"
        tabIndex={-1}
      >
        {/* SR */}
        <ArrowLongLeftIcon
          className="h-6 w-6"
          onClick={() => window.history.back()} // controlled with popstate
        />
      </div>
    </footer>
  );
}
