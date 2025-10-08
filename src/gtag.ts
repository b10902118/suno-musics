import type { AudioInfo } from "./types";

function gtag(...args: [string, string, Record<string, unknown>?]) {
  try {
    //@ts-ignore
    if (typeof window.gtag === "function") {
      //@ts-ignore
      window.gtag(...args);
    }
  } catch {}
}

export function tagVisit(page_path: string) {
  gtag("event", "page_view", {
    page_path,
  });
}

export function tagLike(selectedImage: AudioInfo) {
  gtag("event", "audio_like", {
    event_category: "Audio",
    origin: selectedImage.origin,
  });
}

export function tagUnlike(selectedImage: AudioInfo) {
  gtag("event", "audio_unlike", {
    event_category: "Audio",
    origin: selectedImage.origin,
  });
}

export function tagDownload(selectedImage: AudioInfo) {
  gtag("event", "audio_download", {
    event_category: "Audio",
    origin: selectedImage.origin,
  });
}
