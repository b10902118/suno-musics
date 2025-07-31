import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import "./style.css";
import ImageGallery from "./ImageGallery";

function GalleryRoutes() {
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    fetch("/genres.json")
      .then((res) => res.json())
      .then(setGenres);
  }, []);

  if (genres.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <nav>
        {genres.map((genre) => (
          <Link key={genre} to={`/${genre}`} style={{ marginRight: 10 }}>
            {genre}
          </Link>
        ))}
      </nav>
      <Routes>
        <Route path="/" element={<Navigate to={`/${genres[0]}`} replace />} />
        {genres.map((genre) => (
          <Route
            key={genre}
            path={`/${genre}`}
            element={<ImageGallery key={genre} genre={genre} />}
          />
        ))}
        <Route path="*" element={<div>Not found</div>} />
      </Routes>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <GalleryRoutes />
  </BrowserRouter>
);
