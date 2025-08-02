import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useFooterStore } from "./store";
import { capitalize } from "./utils";

const genre2icon = {
  popular: "🔥",
  nature: "🌎",
};

export default function Menu({ genres }: { genres: string[] }) {
  const { setMenu } = useFooterStore.getState();
  const location = useLocation();
  useEffect(() => {
    setMenu();
  }, []);

  useEffect(() => {
    // Focus on the link of the hash genre, if none, focus on the first link
    const hashGenre = location.hash.slice(1);
    console.log("hashGenre", hashGenre);
    let firstLink = document.querySelector(`.menu-link[href="/${hashGenre}"]`);
    if (!firstLink) {
      firstLink = document.querySelector(".menu-link");
    }
    firstLink.focus();
  }, []);
  return (
    <div className="h-full w-full flex items-start justify-start bg-white overflow-y-auto">
      <nav
        className="h-full w-full w-64 px-4 py-8 bg-gray-50 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <ul className="flex flex-col gap-2">
          {genres.map((genre) => (
            <li key={genre} className="">
              <Link
                to={`/${genre}`}
                className="menu-link block rounded-md px-4 py-3 text-black text-lg font-medium focus:bg-blue-100 focus:text-blue-700 focus:outline-none transition-colors duration-150"
              >
                {genre2icon[genre]} {capitalize(genre)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
