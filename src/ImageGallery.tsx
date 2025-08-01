import { useState, useEffect, useRef } from "react";
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

  // for focus on viwer close
  const selectedImageIdxRef = useRef(null);
  selectedImageIdxRef.current = selectedImageIdx;

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
    const div = document.querySelector(
      `.preview-box[data-id="${selectedImageIdxRef.current}"]`
    ) as HTMLElement | null;
    if (div) div.focus();

    setSelectedImageIdx(null);
  };

  // Helper to decide aspect class
  const getAspectClass = (id: number) => {
    const dims = imageDims[id];
    if (!dims) return ""; // "aspect-[3/4]"; // zooming effect
    return dims.width > dims.height ? "aspect-[4/3]" : "aspect-[3/4]";
  };

  return (
    <div className="h-full w-full bg-gray-50">
      {/* Gallery Grid - Always two columns */}
      <div className="flex gap-1 py-2 px-2 overflow-y-auto h-full">
        {/* Two Columns */}
        {[0, 1].map((col) => (
          <div key={col} className="flex-1">
            {images
              .filter((_, i) => i % 2 === col)
              .map((image) => (
                <div
                  key={image.id}
                  data-id={image.id}
                  className={mixClass(
                    "preview-box",
                    getAspectClass(image.id),
                    "rounded-sm overflow-hidden duration-300 cursor-pointer group focus:outline-none focus:ring-4 focus:ring-blue-500 mb-1"
                  )}
                  onClick={() => handleImageClick(image)}
                  onKeyDown={
                    selectedImageIdx === null
                      ? (e) => {
                          if (e.key === "Enter") handleImageClick(image);
                        }
                      : undefined
                  }
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
        ))}
      </div>

      {/* Image Viewer Modal */}
      {selectedImageIdx !== null && (
        <ImageViewer
          selectedImage={images[selectedImageIdx]}
          onClose={closeModal}
          nextImage={() =>
            setSelectedImageIdx((prev) => (prev + 1) % images.length)
          }
          prevImage={() =>
            setSelectedImageIdx(
              (prev) => (prev - 1 + images.length) % images.length
            )
          }
        />
      )}
    </div>
  );
}
