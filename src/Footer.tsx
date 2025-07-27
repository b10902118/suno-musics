"use client";

import { useEffect } from "react";
import { mixClass } from "class-lib";
import {
  ArrowDownTrayIcon,
  ArrowLongLeftIcon,
} from "@heroicons/react/24/solid";

export default function Footer({ onDownload }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onDownload();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onDownload]);

  return (
    <footer
      dir="ltr"
      className={mixClass(
        "fixed bottom-0 z-[5000] bg-black",
        "pointer-events-none box-border flex min-w-full px-1 py-0.5",
        "min-h-[1.25rem] text-2xl cm-qvga:min-h-[2.375rem] cm-qvga:text-2xl"
      )}
    >
      <div
        className="text-white pointer-events-auto flex cursor-pointer items-center justify-center outline-none"
        tabIndex={-1}
      >
        {/* SL */}
        {<ArrowDownTrayIcon className="h-6 w-6" onClick={onDownload} />}
      </div>
      <div
        className={mixClass(
          "relative grow overflow-hidden whitespace-nowrap text-center font-bold gap-2 flex justify-center items-center"
        )}
      >
        {/* Enter */}
      </div>
      <div
        className="text-white pointer-events-auto flex cursor-pointer items-center justify-center outline-none"
        tabIndex={-1}
        onClick={() => {
          history.back();
        }}
      >
        {/* SR */}
        <ArrowLongLeftIcon className="h-6 w-6" onClick={() => history.back()} />
      </div>
    </footer>
  );
}
