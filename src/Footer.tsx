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
import { capitalize } from "./utils";

export default function Footer() {
  const { status, genre, favorites, onSL, centerText, selectedImage } =
    useFooterStore();

  const { addFavorite, removeFavorite } = useFooterStore.getState();

  const isFavorite = favorites.some(
    (obj) => obj.origin === selectedImage?.origin
  );

  function toggleLike() {
    if (isFavorite) {
      removeFavorite(selectedImage);
    } else {
      addFavorite(selectedImage);
    }
  }

  const onEnter = selectedImage ? toggleLike : null;

  // Choose icon based on status
  const SLIcon =
    status === "gallery"
      ? Bars3Icon
      : status === "viewer" && genre !== "favorite"
      ? ArrowDownTrayIcon
      : null;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && SLIcon && onSL) onSL();
      if (e.key === "Enter" && onEnter) onEnter();
    }

    // delay to prevent enter continuous firing
    timeoutId = setTimeout(() => {
      window.addEventListener("keydown", handleKeyDown);
    }, 300); // delay in ms

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSL, onEnter]);

  const iconClassName =
    "h-[7.5vh] aspect-square pointer-events-auto cursor-pointer";

  return (
    <footer
      dir="ltr"
      className="flex flex-shrink-0 bg-black pointer-events-none box-border w-screen px-[2vw] py-[0.5vh] text-white"
    >
      <div className="flex items-center justify-center">
        {/* SL */}
        {SLIcon ? (
          <SLIcon className={iconClassName} onClick={onSL} />
        ) : (
          <div className="h-[7.5vh] aspect-square" />
        )}
      </div>
      <div className="flex justify-center items-center text-center grow overflow-hidden whitespace-nowrap font-bold">
        {/* Enter */}
        {status === "viewer" ? (
          isFavorite ? (
            <HeartIconSolid
              className={mixClass(iconClassName, "text-red-500")}
              onClick={onEnter}
            />
          ) : (
            <HeartIconOutline className={iconClassName} onClick={onEnter} />
          )
        ) : status === "gallery" ? (
          <span className="text-[5vh] text-gray-300 cursor-pointer">
            {capitalize(centerText)}
          </span>
        ) : null}
      </div>
      <div className="flex items-center justify-center">
        {/* SR */}
        <ArrowLongLeftIcon
          className={iconClassName}
          onClick={() => window.history.back()} // controlled with popstate
        />
      </div>
    </footer>
  );
}
