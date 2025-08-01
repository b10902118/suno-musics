import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./style.css";
import ImageGallery from "./ImageGallery";

function GalleryRoutes() {
  const [genres, setGenres] = useState<string[]>([]);
  //const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/genres.json")
      .then((res) => res.json())
      .then(setGenres);
  }, []);

  // Toggle menu with Escape key
  // TODO: least precedence
  /*
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen((open) => !open);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  */

  if (genres.length === 0) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-screen w-screen">
      {/* Overlay menu */}
      {/*
      menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center"
          onClick={() => setMenuOpen(false)}
        >
          <nav
            className="bg-white p-6 rounded-lg min-w-[200px] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-2">Genres</h2>
            {genres.map((genre) => (
              <div key={genre} className="my-2">
                <Link
                  to={`/${genre}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-gray-800 no-underline hover:underline"
                >
                  {genre}
                </Link>
              </div>
            ))}
          </nav>
        </div>
      )
        */}
      <div className="flex-1 flex flex-col overflow-y-auto">
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
      {/*footer*/}
      <div className="h-10 flex-shrink-0" />
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
    <BrowserRouter>
      <GalleryRoutes />
    </BrowserRouter>
  );
} else {
  createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
      <GalleryRoutes />
    </BrowserRouter>
  );
}
