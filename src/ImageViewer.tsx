import Footer from "./Footer";
import { useEffect, useRef } from "react";
import pica from "pica";

const picaInstance = pica();

export default function ImageViewer({
  selectedImage,
  onClose,
  /*
  nextImage,
  prevImage,
  */
}) {
  const imgRef = useRef(null);

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

  /*
  useEffect(() => {
    const handleLeftRightArrow = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        console.log("prevImage");
        prevImage();
      } else if (e.key === "ArrowRight") {
        console.log("nextImage");
        nextImage();
      }
    };
    window.addEventListener("keydown", handleLeftRightArrow);
    return () => {
      window.removeEventListener("keydown", handleLeftRightArrow);
    };
  }, [nextImage, prevImage]);
  */

  async function downloadImage(img: HTMLImageElement, filename: string) {
    try {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const ratio =
        Math.max(viewportWidth, viewportHeight) /
        Math.max(img.naturalWidth, img.naturalHeight);

      const targetWidth = Math.round(img.naturalWidth * ratio);
      const targetHeight = Math.round(img.naturalHeight * ratio);

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      try {
        await picaInstance.resize(img, canvas);
      } catch (picaError) {
        // Fallback: use native canvas 2D drawImage
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        } else {
          console.error("Canvas 2D context not available for fallback resize.");
          throw picaError;
        }
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("downloadImage: canvas toBlob failed");
            return;
          }
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = filename + ".jpg";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        },
        "image/jpeg",
        0.95
      );
    } catch (error) {
      console.error("Download failed:", error);
    }
  }

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-80 flex justify-center z-50"
      onClick={onClose}
    >
      {/*
      <h3 className="absolute z-10 top-0 left-0 w-full text-xl text-white font-normal px-4 py-2 bg-gradient-to-b from-black/70 to-transparent">
        {selectedImage.title}
      </h3>
        */}

      <img
        src={selectedImage.url}
        className="object-contain max-w-full max-h-full"
        ref={imgRef}
      />

      <Footer
        onDownload={() =>
          downloadImage(imgRef.current, selectedImage.id.toString())
        }
        onBack={onClose}
      />
    </div>
  );
}
