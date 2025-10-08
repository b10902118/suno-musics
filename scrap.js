import { readFileSync, writeFileSync, readdirSync, unlinkSync } from "fs";
import { mkdirSync, existsSync, createWriteStream } from "fs";
import { join } from "path";
import axios from "axios";
import { createReadStream } from "fs";
import readline from "readline";
import cliProgress from "cli-progress";

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

const categories = JSON.parse(readFileSync("./public/genres.json", "utf-8"));

async function retry(f, n = 3) {
  let attempt = 0;
  while (attempt < n) {
    try {
      return f(attempt);
    } catch {
      attempt++;
      if (attempt === n) {
        throw new Error(`Failed after ${n} attempts: ${err.message}`);
      }
    }
  }
}

async function getRandomData(filePath, count) {
  // First pass: count lines
  let totalLines = 0;
  const rl1 = readline.createInterface({ input: createReadStream(filePath) });
  for await (const _ of rl1) totalLines++;
  rl1.close();

  // Pick random unique line numbers
  const chosen = new Set();
  while (chosen.size < count && chosen.size < totalLines) {
    chosen.add(Math.floor(Math.random() * totalLines));
  }

  // Second pass: collect chosen lines
  const result = [];
  let idx = 0;
  const rl2 = readline.createInterface({ input: createReadStream(filePath) });
  for await (const line of rl2) {
    if (chosen.has(idx)) result.push(JSON.parse(line));
    idx++;
    if (result.length === chosen.size) break;
  }
  rl2.close();
  return result;
}

async function scrap(genre) {
  // data at ./data/${category}.jsonl, randomly select 50 lines from the file
  const audioData = await getRandomData(`./data/${genre}.jsonl`, 10);

  const dir = `./public/audio/${genre}`;
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  } else {
    const files = readdirSync(dir);
    for (const file of files) {
      unlinkSync(join(dir, file));
    }
  }

  const catalog = [];

  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  bar.start(audioData.length, 0);
  for (let i = 0; i < audioData.length; i++) {
    const audioDatum = audioData[i];
    try {
      await fetchAudio(audioDatum.audio_url, i, dir); //retry(fetchImage.bind(null, imgUrl, i));
      // push if succ
      catalog.push({
        url: `audio/${genre}/${i}.mp3`,
        origin: audioDatum.audio_url,
        title: audioDatum.title,
        image: audioDatum.image_url,
        tags: audioDatum.metadata.tags,
        duration: audioDatum.metadata.duration,
      });
    } catch (e) {
      console.error(
        `Error downloading "${audioDatum.audio_url}": ${e.message}`
      );
    }
    bar.update(i + 1);
    await new Promise((r) => setTimeout(r, 5000));
  }
  bar.stop();

  writeFileSync(`./public/${genre}.json`, JSON.stringify(catalog, null, 2));

  console.log("--------------------------------------------------");
}

async function runSequentially() {
  for (const category of categories) {
    await scrap(category);
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

runSequentially();
