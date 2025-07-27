import { useState, useEffect } from "react";
import ImageViewer from "./ImageViewer";

interface ImageInfo {
  id: number;
  author: string;
  title: string;
  url: string;
}

export default function ImageGallery() {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null);

  useEffect(() => {
    fetch("/popular.json")
      .then((res) => res.json())
      .then((data) => setImages(data.reverse())); // latest first
  }, []);

  useEffect(() => {
    const firstWallpaperElement = document.querySelector('[tabindex="0"]');
    if (firstWallpaperElement) {
      (firstWallpaperElement as HTMLElement).focus();
    }
  }, [images]);

  const handleImageClick = (img: ImageInfo) => {
    setSelectedImage(img);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4">
      <div className="flex justify-center max-w-full mx-auto px-2">
        {/* Gallery Grid - Two columns with fixed viewport width */}
        <div className="flex flex-wrap justify-between gap-y-2">
          {images.map((wallpaper) => (
            <div
              key={wallpaper.id}
              className="bg-white rounded-lg w-[45vw] shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group focus:outline-none focus:ring-4 focus:ring-blue-500"
              onClick={() => handleImageClick(wallpaper)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleImageClick(wallpaper);
              }}
              tabIndex={0}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={wallpaper.url}
                  alt={wallpaper.title}
                  loading="lazy"
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Image Viewer Modal */}
        {selectedImage && (
          <ImageViewer selectedImage={selectedImage} onClose={closeModal} />
        )}
      </div>
    </div>
  );
}
