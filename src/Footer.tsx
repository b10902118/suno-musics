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
      removeFavorite(selectedImage.origin);
    } else {
      addFavorite(selectedImage.origin);
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

  return (
    <footer
      dir="ltr"
      className={
        "flex flex-shrink-0 bg-black pointer-events-none box-border w-screen px-1 py-0.5 text-white"
      }
    >
      <div
        className="pointer-events-auto flex cursor-pointer items-center justify-center outline-none"
        tabIndex={-1}
      >
        {/* SL */}
        {SLIcon ? (
          <SLIcon className="h-6 w-6" onClick={onSL} />
        ) : (
          <div className="h-6 w-6" />
        )}
      </div>
      <div
        className={mixClass(
          "relative grow pointer-events-auto cursor-pointer overflow-hidden whitespace-nowrap text-center font-bold gap-2 flex justify-center items-center"
        )}
      >
        {/* Enter */}
        {status === "viewer" ? (
          isFavorite ? (
            <HeartIconSolid
              className="h-6 w-6 text-red-500"
              onClick={onEnter}
            />
          ) : (
            <HeartIconOutline className="h-6 w-6" onClick={onEnter} />
          )
        ) : status === "gallery" ? (
          <span className="text-gray-300">{capitalize(centerText)}</span>
        ) : null}
      </div>
      <div
        className="pointer-events-auto flex cursor-pointer items-center justify-center outline-none"
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
