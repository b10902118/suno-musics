import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./style.css";
import ImageGallery from "./ImageGallery";
import Footer from "./Footer";
import Menu from "./Menu";
import About from "./About";

function GalleryRoutes() {
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}genres.json`)
      .then((res) => res.json())
      .then(setGenres);
  }, []);

  if (genres.length === 0) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to={`/${genres[0]}`} replace />} />
          <Route path="/menu" element={<Menu genres={genres} />} />
          <Route path="/about" element={<About />} />
          {genres.map((genre) => (
            <Route
              key={genre}
              path={`/${genre}`}
              element={<ImageGallery key={genre} genre={genre} />}
            />
          ))}
          <Route
            key="favorite"
            path="/favorite"
            element={<ImageGallery key="favorite" genre="favorite" />}
          />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </div>
      {/*footer*/}
      <Footer />
    </div>
  );
}

if (import.meta.env.DEV) {
  // prevent HMR rerun createRoot
  const container = document.getElementById("root")!;

  // @ts-ignore
  let root = (window as any).__root;

  if (!root) {
    root = createRoot(container);
    // @ts-ignore
    (window as any).__root = root;
  }

  root.render(
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <GalleryRoutes />
    </BrowserRouter>
  );
} else {
  createRoot(document.getElementById("root")!).render(
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <GalleryRoutes />
    </BrowserRouter>
  );
}
