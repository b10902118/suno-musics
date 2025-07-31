import { useState, useEffect } from "react";
import ImageViewer from "./ImageViewer";
import { mixClass } from "class-lib";

interface ImageInfo {
  id: number;
  url: string;
}

interface ImageDims {
  [id: number]: { width: number; height: number };
}

export default function ImageGallery({ genre }) {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState<number | null>(null);
  const [imageDims, setImageDims] = useState<ImageDims>({});

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}${genre}.json`)
      .then((res) => res.json())
      .then((data) =>
        setImages(
          data.map((item, idx) => ({
            id: idx,
            url: import.meta.env.BASE_URL + item.url,
          }))
        )
      );
  }, []);

  useEffect(() => {
    const firstWallpaperElement = document.querySelector(".preview-box");
    if (firstWallpaperElement) {
      (firstWallpaperElement as HTMLElement).focus();
    }
  }, [images]);

  const handleImageClick = (img: ImageInfo) => {
    setSelectedImageIdx(img.id);
  };

  const closeModal = () => {
    /* FIXME: Needed for next/prev image in viewer
    const div = document.querySelectorAll(".preview-box")[selectedImageIdx] as
      | HTMLElement
      | undefined;
    console.log(div);
    if (div) div.focus();
    */

    setSelectedImageIdx(null);
  };

  // Helper to decide aspect class
  const getAspectClass = (id: number) => {
    const dims = imageDims[id];
    if (!dims) return ""; // "aspect-[3/4]"; // zooming effect
    return dims.width > dims.height ? "aspect-[4/3]" : "aspect-[3/4]";
  };

  return (
    <div className="h-screen w-screen bg-gray-50">
      {/* Gallery Grid - Always two columns */}
      <div className="flex gap-1 py-2 px-2 overflow-y-auto h-full">
        {/* Left Column */}
        <div className="flex-1">
          {images
            .filter((_, i) => i % 2 === 0)
            .map((image) => (
              <div
                key={image.id}
                className={mixClass(
                  "preview-box",
                  getAspectClass(image.id),
                  "rounded-sm overflow-hidden duration-300 cursor-pointer group focus:outline-none focus:ring-4 focus:ring-blue-500 mb-1"
                )}
                onClick={() => handleImageClick(image)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleImageClick(image);
                }}
                tabIndex={0}
              >
                <img
                  src={image.url}
                  loading="lazy"
                  className="object-cover w-full h-full"
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    setImageDims((dims) => ({
                      ...dims,
                      [image.id]: {
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                      },
                    }));
                  }}
                />
              </div>
            ))}
        </div>
        {/* Right Column */}
        <div className="flex-1 gap-1">
          {images
            .filter((_, i) => i % 2 === 1)
            .map((image) => (
              <div
                key={image.id}
                className={mixClass(
                  "preview-box",
                  getAspectClass(image.id),
                  "rounded-sm overflow-hidden duration-300 cursor-pointer group focus:outline-none focus:ring-4 focus:ring-blue-500 mb-1"
                )}
                onClick={() => handleImageClick(image)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleImageClick(image);
                }}
                tabIndex={0}
              >
                <img
                  src={image.url}
                  loading="lazy"
                  className="object-cover w-full h-full"
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    setImageDims((dims) => ({
                      ...dims,
                      [image.id]: {
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                      },
                    }));
                  }}
                />
              </div>
            ))}
        </div>
      </div>

      {/* Image Viewer Modal */}
      {selectedImageIdx !== null && (
        <ImageViewer
          selectedImage={images[selectedImageIdx]}
          onClose={closeModal}
        />
      )}
      {/*
          // FIXME: next is in the same column
          // can't know item at which column
          nextImage={() =>
            setSelectedImageIdx((prev) => (prev + 1) % images.length)
          }
          prevImage={() =>
            setSelectedImageIdx(
              (prev) => (prev - 1 + images.length) % images.length
            )
          }
        */}
    </div>
  );
}
