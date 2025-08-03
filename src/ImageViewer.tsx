import { useEffect, useRef } from "react";
import { useFooterStore } from "./store";
import type { ImageInfo } from "./types";

interface ImageViewerProps {
  genre: string;
  selectedImage: ImageInfo;
  onClose: () => void;
  nextImage: () => void;
  prevImage: () => void;
}

export default function ImageViewer({
  genre,
  selectedImage,
  onClose,
  nextImage,
  prevImage,
}: ImageViewerProps) {
  const { setViewer } = useFooterStore.getState();

  const imgRef = useRef<HTMLImageElement | null>(null);

  // strict mode will cause issues
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    function handlePopState() {
      window.history.pushState(null, "", window.location.href);
      onClose();
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.history.back();
    };
  }, []); // no dependency to prevent rerender trigger cleanup
  // onClose cannot be updated, relying on binding ref

  useEffect(() => {
    const handleLeftRightArrow = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && !e.altKey) {
        prevImage();
      } else if (e.key === "ArrowRight" && !e.altKey) {
        nextImage();
      }
    };
    window.addEventListener("keydown", handleLeftRightArrow);
    return () => {
      window.removeEventListener("keydown", handleLeftRightArrow);
    };
  }, [nextImage, prevImage]);

  useEffect(() => {
    const captions =
      selectedImage.tags.length >= 3
        ? selectedImage.tags.slice(3).join("_")
        : selectedImage.id;
    const filename = `${genre}-${captions}`;
    setViewer(imgRef, filename);
  }, [selectedImage]);

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center z-50">
      <img
        src={selectedImage.url}
        className="object-contain max-w-full max-h-full"
        ref={imgRef}
      />
    </div>
  );
}
