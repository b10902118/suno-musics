import { createRoot } from "react-dom/client";
import "./style.css";
import ImageGallery from "./ImageGallery";

createRoot(document.getElementById("root")!).render(
  <ImageGallery genre="popular" />
);
