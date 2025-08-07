import type { ImageInfo } from "./types";
import { compress } from "./compress";

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

export function tagLike(selectedImage: ImageInfo) {
  gtag("event", "image_like", {
    event_category: "Image",
    origin: compress(selectedImage.origin),
  });
}

export function tagUnlike(selectedImage: ImageInfo) {
  gtag("event", "image_unlike", {
    event_category: "Image",
    origin: compress(selectedImage.origin),
  });
}

export function tagDownload(selectedImage: ImageInfo) {
  gtag("event", "image_download", {
    event_category: "Image",
    origin: compress(selectedImage.origin),
  });
}

export function tagView(selectedImage: ImageInfo) {
  gtag("event", "image_view", {
    event_category: "Image",
    origin: compress(selectedImage.origin),
  });
}
