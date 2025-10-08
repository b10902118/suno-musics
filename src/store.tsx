import { create } from "zustand";
import type { AudioInfo } from "./types";
import { tagLike, tagUnlike } from "./gtag";

interface FooterStore {
  status: "menu" | "gallery" | "viewer";
  genre: string | null;
  favorites: AudioInfo[];
  addFavorite: (imgInfo: AudioInfo) => void;
  removeFavorite: (imgInfo: AudioInfo) => void;
  selectedImage: AudioInfo | null;
  setSelectedImage: (image: AudioInfo | null) => void;
  onSL: () => void | null;
  centerText: string | null;
  setMenu: () => void;
  setGallery: (genre: string, onSL: () => void) => void;
}

function getFavorites() {
  const favJSON = localStorage.getItem("suno-musics-favorite");
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

  return {
    status: "gallery",
    genre: null,
    favorites: getFavorites(),
    addFavorite: (imgInfo: AudioInfo) => {
      const info = { ...imgInfo, url: "" };
      const newFavs = [...get().favorites, info];
      localStorage.setItem("suno-musics-favorite", JSON.stringify(newFavs));
      set({ favorites: newFavs });
      tagLike(info);
    },
    removeFavorite: (imgInfo: AudioInfo) => {
      const newFavs = get().favorites.filter(
        (fav) => fav.origin !== imgInfo.origin
      );
      localStorage.setItem("suno-musics-favorite", JSON.stringify(newFavs));
      set({ favorites: newFavs });
      //track image_unlike event
      tagUnlike(imgInfo);
    },
    selectedImage: null,
    setSelectedImage: (image) => {
      set({ selectedImage: image });
    },
    onSL: null,
    centerText: null, // to be set by gallery
    setMenu,
    setGallery,
  };
});
