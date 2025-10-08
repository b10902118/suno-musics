import { readFileSync, writeFileSync, readdirSync, unlinkSync } from "fs";
import { mkdirSync, existsSync, createWriteStream } from "fs";
import { join } from "path";
import axios from "axios";
import { createReadStream } from "fs";
import readline from "readline";

async function getWithTimeout(url, options = {}, timeout = 10000) {
  const res = await axios.get(url, {
    ...options,
    timeout,
  });
  return res.data;
}

async function fetchAudio(audioUrl, i, dir, attempt = 0) {
  const data = await getWithTimeout(audioUrl, { responseType: "stream" });
  const filePath = join(dir, `${i}.mp3`);
  data.pipe(createWriteStream(filePath));
}

await fetchAudio(
  "https://cdn1.suno.ai/157df64d-17e1-42d7-bb87-119d679caa25.mp3",
  0,
  "."
);
