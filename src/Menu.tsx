import { Link } from "react-router-dom";
export default function Menu({ genres }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-white">
      <nav
        className="w-full max-w-md px-8 py-12"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-semibold mb-8 text-center">Genres</h2>
        <div className="flex flex-col gap-4">
          {genres.map((genre) => (
            <Link
              key={genre}
              to={`/${genre}`}
              className="text-gray-800 text-xl no-underline hover:underline text-center"
            >
              {genre}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
