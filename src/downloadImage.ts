import pica from "pica";
import type { RefObject } from "react";

const picaInstance = pica();

export default async function downloadImage(
  imgRef: RefObject<HTMLImageElement>,
  filename: string
) {
  const img = imgRef.current;
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
