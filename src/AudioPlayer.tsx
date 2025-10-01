import { useRef, useState, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  ArrowDownTrayIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

export default function AudioPlayer({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hearted, setHearted] = useState(false);

  const titleRef = useRef<HTMLSpanElement>(null);
  const authorRef = useRef<HTMLSpanElement>(null);
  const [titleOverflow, setTitleOverflow] = useState(false);
  const [authorOverflow, setAuthorOverflow] = useState(false);

  useEffect(() => {
    if (titleRef.current) {
      setTitleOverflow(
        titleRef.current.scrollWidth > titleRef.current.clientWidth
      );
    }
  }, [title]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("timeupdate", updateTime);

    //audio.load();
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      // due to reject when pause op in progress
      setTimeout(() => {
        audio.currentTime = 0; // Reset to start
      }, 1000);
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex items-center w-full">
      <div className="w-[20%] flex justify-start">
        <button
          onClick={togglePlay}
          className="bg-transparent border-none p-0 "
        >
          {isPlaying ? (
            <PauseIcon className="w-[60%] text-gray-700" />
          ) : (
            <PlayIcon className="w-[60%] text-gray-700" />
          )}
        </button>
      </div>
      <div className="flex flex-col font-sans w-[55%] overflow-hidden">
        <span
          className={`font-bold text-lg text-nowrap ${
            titleOverflow ? "marquee" : ""
          }`}
          style={{ width: "100%", display: "block" }}
          ref={titleRef}
        >
          <span>{title}</span>
        </span>
        <span
          className={`text-gray-500 text-sm text-nowrap ${
            authorOverflow ? "marquee" : ""
          }`}
          style={{ width: "100%", display: "block" }}
          ref={authorRef}
        >
          <span>suno</span>
        </span>
        <span className="font-small">
          {isPlaying
            ? `${formatTime(currentTime)} / ${formatTime(duration)}`
            : formatTime(duration)}
        </span>
      </div>
      <div className="flex gap-2 w-[25%] justify-end">
        <a
          href={src}
          download
          className="w-1/2 bg-transparent border-none p-0 flex items-center justify-center"
        >
          <ArrowDownTrayIcon className="text-gray-700 w-full h-full" />
        </a>
        <button
          className="w-1/2 bg-transparent border-none p-0"
          onClick={() => setHearted((h) => !h)}
        >
          <HeartIcon className={hearted ? "text-red-500" : "text-gray-700"} />
        </button>
      </div>
      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={(e) => {
          console.log("duration:", e.target.duration);
          setDuration(e.target.duration || 0);
        }}
        preload="metadata"
        key={src}
      />
    </div>
  );
}
