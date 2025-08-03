import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useFooterStore } from "./store";
import { capitalize } from "./utils";

const genre2icon = {
  popular: "🔥",
  nature: "🌎",
  favorite: "❤️",
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
    let firstLink = document.querySelector(`.menu-link[href="/${hashGenre}"]`);
    if (!firstLink) {
      firstLink = document.querySelector(".menu-link");
    }
    // @ts-ignore
    firstLink.focus();
  }, []);

  const linkClassName =
    "menu-link block rounded-md px-[3vw] py-[3vh] text-black text-[8vw] font-medium focus:bg-blue-100 focus:text-blue-700 focus:outline-none transition-colors duration-150";
  return (
    <div className="h-full w-full flex items-start justify-start bg-white">
      <nav
        className="h-full w-full px-[6vw] py-[6vh] bg-gray-50 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <ul className="flex flex-col gap-[2vh]">
          {genres.map((genre) => (
            <li key={genre}>
              <Link to={`/${genre}`} className={linkClassName}>
                {genre2icon[genre]} {capitalize(genre)}
              </Link>
            </li>
          ))}
          <li key="favorite" className="">
            <Link to={`/favorite`} className={linkClassName}>
              {genre2icon["favorite"]} {capitalize("favorite")}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
