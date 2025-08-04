import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useFooterStore } from "./store";
import { capitalize } from "./utils";

const genre2icon = {
  favorite: "❤️",
  popular: "🔥",
  nature: "🌎",
  food: "🌮",
  animal: "🐶",
  woman: "♀️",
  man: "♂️",
};

export default function Menu({ genres }: { genres: string[] }) {
  const { setMenu } = useFooterStore.getState();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    setMenu();
  }, []);

  useEffect(() => {
    // Focus on the link of the hash genre, if none, focus on the first link
    const hashGenre = location.hash.slice(1);
    let firstLink = document.querySelector(
      `.menu-button[data-genre="${hashGenre}"]`
    );
    if (!firstLink) {
      firstLink = document.querySelector(".menu-button");
    }
    // @ts-ignore
    firstLink.focus();
  }, []);

  const handleNav = (genre: string, replace: boolean) => {
    navigate(`/${genre}`, { replace });
  };

  const linkClassName =
    "menu-button block w-full text-start rounded-md px-[3vw] py-[3vh] text-black text-[8vw] focus:bg-blue-100 focus:text-blue-700 focus:outline-none transition-colors duration-150";

  const MenuEntry = ({
    genre,
    replace = true,
  }: {
    genre: string;
    replace?: boolean;
  }) => (
    <li key={genre}>
      <button
        type="button"
        data-genre={genre}
        className={linkClassName}
        onClick={() => handleNav(genre, replace)}
      >
        {genre2icon[genre]} {capitalize(genre)}
      </button>
    </li>
  );

  const Divider = () => (
    <li>
      <hr className="border-gray-300" />
    </li>
  );

  return (
    <div className="h-full w-full flex items-start justify-start bg-white">
      <nav
        className="h-full w-full px-[6vw] py-[6vh] bg-gray-50 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <ul className="flex flex-col gap-[2vh]">
          <MenuEntry genre="favorite" />
          <Divider />
          {genres.map((genre) => (
            <MenuEntry key={genre} genre={genre} />
          ))}
          <Divider />
          <MenuEntry genre="about" replace={false} />
        </ul>
      </nav>
    </div>
  );
}
