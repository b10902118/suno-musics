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
            className="flex items-center border border-gray-200 p-4 shadow-sm"
          >
            <AudioPlayer title={music.title} src={music.url} />
          </li>
        ))}
      </ul>
    </div>
  );
}
