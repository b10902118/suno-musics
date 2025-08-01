import { create } from "zustand";

interface FooterStore {
  status: "menu" | "gallery" | "viewer";
  onSL: () => void;
  centerText: string | null;
  onEnter: () => void;
  setMenu: () => void;
  setGallery: (genre: string, onSL: () => void) => void;
  setViewer: (onDownload: () => void, onLike: () => void) => void;
}

export const useFooterStore = create<FooterStore>((set) => {
  const setMenu = () => {
    set({ status: "menu", onSL: () => {}, centerText: null, onEnter: null });
  };
  const setGallery = (genre: string, onMenu: () => void) =>
    set({
      status: "gallery",
      onSL: onMenu,
      centerText: genre,
      onEnter: () => {},
    });
  const setViewer = (onDownload: () => void, onLike: () => void) =>
    set({
      status: "viewer",
      onSL: onDownload,
      centerText: null,
      onEnter: onLike,
    });

  return {
    status: "gallery",
    onSL: () => {},
    centerText: null, // to be set by gallery
    onEnter: () => {},
    setMenu,
    setGallery,
    setViewer,
  };
});
