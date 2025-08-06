import { create } from "zustand";
import type { ImageInfo } from "./types";
import downloadImage from "./downloadImage";
import type { RefObject } from "react";

interface FooterStore {
  status: "menu" | "gallery" | "viewer";
  genre: string | null;
  favorites: ImageInfo[];
  addFavorite: (imgInfo: ImageInfo) => void;
  removeFavorite: (imgInfo: ImageInfo) => void;
  selectedImage: ImageInfo | null;
  setSelectedImage: (image: ImageInfo | null) => void;
  onSL: () => void | null;
  centerText: string | null;
  setMenu: () => void;
  setGallery: (genre: string, onSL: () => void) => void;
  setViewer: (
    imgRef: RefObject<HTMLImageElement>,
    selectedImage: ImageInfo
  ) => void;
}

function getFavorites() {
  const favJSON = localStorage.getItem("favorite");
  if (favJSON) {
    try {
      return JSON.parse(favJSON);
    } catch {
      return [];
    }
  }
  return [];
}

export const useFooterStore = create<FooterStore>((set, get) => {
  const setMenu = () => {
    set({
      status: "menu",
      onSL: null,
      centerText: null,
    });
  };
  const setGallery = (genre: string, onMenu: () => void) =>
    set({
      status: "gallery",
      genre,
      onSL: onMenu,
      centerText: genre,
    });
  const setViewer = (
    imgRef: RefObject<HTMLImageElement>,
    selectedImage: ImageInfo
  ) =>
    set({
      status: "viewer",
      onSL: () => downloadImage(imgRef, selectedImage),
      centerText: null,
    });

  return {
    status: "gallery",
    genre: null,
    favorites: getFavorites(),
    addFavorite: (imgInfo: ImageInfo) => {
      const info = { ...imgInfo, url: "" };
      const newFavs = [...get().favorites, info];
      localStorage.setItem("favorite", JSON.stringify(newFavs));
      set({ favorites: newFavs });
      //track image_like event
      try {
        //@ts-ignore
        if (typeof window.gtag === "function") {
          //@ts-ignore
          window.gtag("event", "image_like", {
            event_category: "Image",
            event_label: imgInfo.origin,
          });
        }
      } catch {}
    },
    removeFavorite: (imgInfo: ImageInfo) => {
      const newFavs = get().favorites.filter(
        (fav) => fav.origin !== imgInfo.origin
      );
      localStorage.setItem("favorite", JSON.stringify(newFavs));
      set({ favorites: newFavs });
      //track image_unlike event
      try {
        //@ts-ignore
        if (typeof window.gtag === "function") {
          //@ts-ignore
          window.gtag("event", "image_unlike", {
            event_category: "Image",
            event_label: imgInfo.origin,
          });
        }
      } catch {}
    },
    selectedImage: null,
    setSelectedImage: (image) => {
      set({ selectedImage: image });
    },
    onSL: null,
    centerText: null, // to be set by gallery
    setMenu,
    setGallery,
    setViewer,
  };
});
