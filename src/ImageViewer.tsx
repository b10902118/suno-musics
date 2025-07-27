import Footer from "./Footer";
import { useEffect } from "react";

export default function ImageViewer({ selectedImage, onClose }) {
  useEffect(() => {
    function handlePopState() {
      // worked!
      window.history.pushState(null, "", window.location.href);
      onClose();
    }
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [onClose]);
  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${filename}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center z-50"
      onClick={onClose}
    >
      <h3 className="absolute z-10 top-0 left-0 w-full text-xl text-white font-normal px-4 py-2 bg-gradient-to-b from-black/70 to-transparent">
        {selectedImage.title}
      </h3>

      <div className="relative">
        <img
          src={selectedImage.url}
          alt={selectedImage.title}
          width={1920}
          height={1080}
          className="max-w-full max-h-[90vh]"
        />
      </div>

      <Footer
        onDownload={() => downloadImage(selectedImage.url, selectedImage.title)}
      />
    </div>
  );
}
