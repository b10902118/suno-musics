import { useNavigate } from "react-router-dom";
import { useFooterStore } from "./store";
import { useEffect, useState } from "react";
import AudioPlayer from "./AudioPlayer";
import type { AudioInfo } from "./types";

export default function MusicList({ genre }: { genre: string }) {
  const [audios, setAudios] = useState<AudioInfo[]>([]);
  const { setGallery } = useFooterStore.getState();
  const navigate = useNavigate();

  useEffect(() => {
    if (genre === "favorite") {
      const favs = localStorage.getItem("suno-musics-favorite");
      if (favs) {
        try {
          const data = JSON.parse(favs);
          setAudios(
            data.map((item, idx) => ({
              ...item,
              id: idx,
              url: item.origin,
            }))
          );
        } catch (e) {
          setAudios([]);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (genre !== "favorite") {
      fetch(`${import.meta.env.BASE_URL}${genre}.json`)
        .then((res) => res.json())
        .then((data) =>
          setAudios(
            data.map((item, idx) => ({
              id: idx,
              ...item,
            }))
          )
        );
    }
  }, []);

  // didn't find a way to set it at store once
  const onGallerySL = () => {
    navigate(`/menu#${genre}`);
  };

  useEffect(() => {
    setGallery(genre, onGallerySL);
  }, [genre]);

  return (
    <div>
      <ul className="list-none p-0">
        {audios.map((music) => (
          <li
            key={music.id}
            className="flex items-center border border-gray-200 px-[4vw] py-[2vh] relative"
            style={{
              backgroundImage: `url(${music.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-white opacity-60 pointer-events-none" />
            <AudioPlayer
              className="relative z-10"
              audioInfo={music}
              canDownload={genre !== "favorite"}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
