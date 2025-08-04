import { JSDOM } from "jsdom";
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from "fs";
import { mkdirSync, existsSync, createWriteStream } from "fs";
import { join } from "path";
import axios from "axios";
import cliProgress from "cli-progress";

async function getWithTimeout(url, options = {}, timeout = 10000) {
  const res = await axios.get(url, {
    ...options,
    timeout,
  });
  return res.data;
}

function getCategories() {
  const genres = JSON.parse(readFileSync("./public/genres.json", "utf-8"));
  return genres.map((genre) => ({
    genre,
    q: genre === "popular" ? "" : genre,
  }));
}

const categories = getCategories();

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

async function fetchParsePage(q, page, attempt = 0) {
  const url = `https://pxhere.com/en/photos?q=${q}&order=popular&page=${page}&format=json`;
  //console.log(`Attempt ${attempt + 1}: Fetching ${url}`);
  const data = await getWithTimeout(url);
  if (!data) {
    throw new Error("no data");
  }
  const dom = new JSDOM(data.data);
  const images = [...dom.window.document.querySelectorAll("img")];
  return images.map((img) => ({
    src: img.src,
    tags: img.title ? img.title.split(",").map((t) => t.trim()) : [],
  }));
}

function randomSelect(arr, count) {
  if (count >= arr.length) {
    throw new Error("randomSelect: Count exceeds array length");
  }
  //random shuffle
  const shuffled = arr.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function sampleNumbers(st, ed, count) {
  const arr = [];
  for (let i = st; i < ed; i++) {
    arr.push(i);
  }
  return randomSelect(arr, count);
}

function samplePages() {
  const pages = [];
  for (let i = 0; i < 5; i++) {
    const count = 5 - i;
    const st = i * 30;
    const ed = st + 30;
    const sampled = sampleNumbers(st, ed, count);
    pages.push(...sampled);
  }
  return pages;
}

async function scrapPages(genre, q) {
  const pages = samplePages();

  const ImgDataPool = [];
  // Do sequentially
  // Progress bar setup
  const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  bar.start(pages.length, 0);

  for (const [idx, page] of pages.entries()) {
    try {
      const imgData = await fetchParsePage(q, page);
      ImgDataPool.push(...imgData);
    } catch (e) {
      console.error(`Error fetching page ${page} for ${genre}: ${e.message}`);
    }
    bar.update(idx + 1);
  }
  bar.stop();
  return ImgDataPool;
}

async function fetchImage(imgUrl, i, dir, attempt = 0) {
  const data = await getWithTimeout(imgUrl, { responseType: "stream" });
  const filePath = join(dir, `${i}.jpg`); // assume all jpg
  data.pipe(createWriteStream(filePath));
}

async function scrap(category) {
  const { genre, q } = category;
  console.log(`Scraping ${genre}...`);
  const ImgDataPool = await scrapPages(genre, q);
  const ImgData = randomSelect(ImgDataPool, 50);

  const dir = `./public/images/${genre}`;
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  } else {
    const files = readdirSync(dir);
    for (const file of files) {
      unlinkSync(join(dir, file));
    }
  }

  const catalog = [];
  await Promise.all(
    ImgData.map(async (imgDatum, i) => {
      try {
        await fetchImage(imgDatum.src, i, dir); //retry(fetchImage.bind(null, imgUrl, i));
        // push if succ
        catalog.push({
          url: `images/${genre}/${i}.jpg`,
          origin: imgDatum.src,
          tags: imgDatum.tags,
        });
      } catch (e) {
        console.error(`Error downloading "${imgDatum.src}": ${e.message}`);
      }
    })
  );

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
