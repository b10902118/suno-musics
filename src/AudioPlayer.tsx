import { useRef, useState, useEffect } from "react";
import {
  PlayIcon,
  StopIcon,
  ArrowDownTrayIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
import type { AudioInfo } from "./types";
import { tagDownload } from "./gtag";
import { useFooterStore } from "./store";

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function AudioPlayer({
  className,
  audioInfo,
  canDownload,
}: {
  className: string;
  audioInfo: AudioInfo;
  canDownload: boolean;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(audioInfo.duration);

  const titleRef = useRef<HTMLSpanElement>(null);
  const authorRef = useRef<HTMLSpanElement>(null);
  const [titleOverflow, setTitleOverflow] = useState(false);
  // @ts-ignore
  const [authorOverflow, setAuthorOverflow] = useState(false);

  const { addFavorite, removeFavorite } = useFooterStore.getState();
  const { currentAudio, setCurrentAudio } = useFooterStore();

  const { favorites } = useFooterStore();
  const isFavorite = favorites.some((obj) => obj.origin === audioInfo?.origin);
  const [liked, setLiked] = useState(isFavorite);

  function toggleLike() {
    if (isFavorite) {
      removeFavorite(audioInfo);
    } else {
      addFavorite(audioInfo);
    }
    setLiked(!isFavorite);
  }

  useEffect(() => {
    if (titleRef.current) {
      setTitleOverflow(
        titleRef.current.scrollWidth > titleRef.current.clientWidth
      );
    }
  }, [audioInfo.title]);

  /*
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    //const updateTime = () => setCurrentTime(audio.currentTime);
    //const handleEnded = () => setIsPlaying(false);

    //audio.addEventListener("timeupdate", updateTime);
    //audio.addEventListener("ended", handleEnded);

    //audio.load();
    return () => {
      //audio.removeEventListener("timeupdate", updateTime);
      //audio.removeEventListener("ended", handleEnded);
    };
  }, []);
  */

  const intervalRef = useRef<number | null>(null);
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    // stop any other playing audio first
    if (!isPlaying && currentAudio && currentAudio !== audio) {
      try {
        currentAudio.pause();
      } catch {}
    }
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      audio.pause();
      // clear global if this was current
      if (currentAudio === audio) setCurrentAudio(null);
      // due to reject when pause op in progress
    } else {
      audio
        .play()
        .catch((e) => {
          // TODO
          console.error("Play error:", e);
        })
        .finally(() => {
          audio.currentTime = 0;
          setCurrentTime(0);
          // even throw it still plays, so use finally
          intervalRef.current = setInterval(() => {
            setCurrentTime(audio.currentTime);
            if (audio.currentTime >= duration) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
              setIsPlaying(false);
              if (currentAudio === audio) setCurrentAudio(null);
            }
          }, 1000);
          setCurrentAudio(audio);
        });
    }
    setIsPlaying(!isPlaying);
  };

  // if another player starts, pause this one
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (currentAudio && currentAudio !== audio && isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      audio.pause();
      setIsPlaying(false);
    }
  }, [currentAudio]);

  return (
    <div className={`flex items-center w-full ${className}`}>
      <div className="w-[20%] flex justify-start">
        <button
          onClick={togglePlay}
          className="w-[60%] aspect-square bg-transparent border-none p-0 "
        >
          {isPlaying ? (
            <StopIcon className="text-gray-700" />
          ) : (
            <PlayIcon className="text-gray-700" />
          )}
        </button>
      </div>
      <div className="flex flex-col font-sans w-[55%] overflow-hidden">
        <span
          className={`font-bold text-[6vh] text-nowrap ${
            titleOverflow ? "marquee" : ""
          }`}
          style={{ width: "100%", display: "block" }}
          ref={titleRef}
        >
          <span>{audioInfo.title}</span>
        </span>
        <span
          className={`text-gray-500 text-sm text-nowrap ${
            authorOverflow ? "marquee" : ""
          }`}
          style={{ width: "100%", display: "block" }}
          ref={authorRef}
        ></span>
        <span className="text-[5vh]">
          {isPlaying
            ? `${formatTime(currentTime)} / ${formatTime(duration)}`
            : formatTime(duration)}
        </span>
      </div>
      <div className="flex gap-2 w-[25%] justify-end">
        <a
          href={audioInfo.url}
          download
          className="w-1/2 bg-transparent border-none p-0 flex items-center justify-center"
          onClick={() => tagDownload(audioInfo)}
          style={{ visibility: canDownload ? "visible" : "hidden" }}
        >
          <ArrowDownTrayIcon className="text-gray-700 w-full h-full" />
        </a>
        <button
          className="w-1/2 bg-transparent border-none p-0"
          onClick={toggleLike}
        >
          <HeartIcon className={liked ? "text-red-500" : "text-gray-700"} />
        </button>
      </div>
      <audio
        ref={audioRef}
        src={audioInfo.url}
        onLoadedMetadata={(e) => {
          // @ts-ignore
          console.log("duration:", e.target.duration);
          // @ts-ignore
          if (e.target.duration) setDuration(e.target.duration);
        }}
        preload="metadata"
        key={audioInfo.url}
      />
    </div>
  );
}
