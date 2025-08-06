import type { ImageInfo } from "./types";
import { compressToUTF16 } from "lz-string";

function gtag(...args: [string, string, Record<string, unknown>?]) {
  try {
    //@ts-ignore
    if (typeof window.gtag === "function") {
      //@ts-ignore
      window.gtag(...args);
    }
  } catch {}
}

function compress(url: string): string {
  let stripped = url;
  if (stripped.startsWith("https://")) {
    stripped = stripped.slice("https://".length);
  } else if (stripped.startsWith("http://")) {
    // should not happen
    stripped = stripped.slice("http://".length);
  }

  try {
    return compressToUTF16(stripped);
  } catch (e) {
    console.error("Compression failed:", e);
    return url; // Fallback to original URL if compression fails
  }
}

export function tagVisit(page_path: string) {
  gtag("event", "page_view", {
    page_path,
  });
}

export function tagLike(selectedImage: ImageInfo) {
  gtag("event", "image_like", {
    event_category: "Image",
    event_label: compress(selectedImage.origin),
  });
}

export function tagUnlike(selectedImage: ImageInfo) {
  gtag("event", "image_unlike", {
    event_category: "Image",
    event_label: compress(selectedImage.origin),
  });
}

export function tagDownload(selectedImage: ImageInfo) {
  gtag("event", "image_download", {
    event_category: "Image",
    event_label: compress(selectedImage.origin),
  });
}

export function tagView(selectedImage: ImageInfo) {
  gtag("event", "image_view", {
    event_category: "Image",
    event_label: compress(selectedImage.origin),
  });
}
