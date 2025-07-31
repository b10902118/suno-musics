import { JSDOM } from "jsdom";
import { writeFileSync } from "fs";
import { mkdirSync, existsSync, createWriteStream } from "fs";
import { join } from "path";
import { pipeline } from "stream";
import { promisify } from "util";

async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  const res = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(timeout),
  });
  return res;
}

const categories = [{ genre: "popular", q: "" }];

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

async function fetchAndParse(category) {
  const { genre, q } = category;
  const page = Math.floor(Math.random() * 151);
  const url = `https://pxhere.com/en/photos?q=${q}&order=popular&page=${page}&format=json`;

  const fetchPage = async (attempt = 0) => {
    console.log(`Attempt ${attempt + 1}: Fetching ${url}`);
    const res = await fetchWithTimeout(url);
    const json = await res.json();
    if (!json.data) {
      throw new Error("no data");
    }
    return json;
  };
  const json = await fetchPage(); // retry(fetchPage);

  const dom = new JSDOM(json.data);
  const images = [...dom.window.document.querySelectorAll("img")];
  const ImgUrls = images.map((img) => img.src);

  const streamPipeline = promisify(pipeline);
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
  const fetchImage = async (imgUrl, i, attempt = 0) => {
    const res = await fetchWithTimeout(imgUrl);
    if (!res.ok) throw new Error(`Failed to fetch image: ${imgUrl}`);
    const filePath = join(dir, `${i}.jpg`); // assume all jpg
    await streamPipeline(res.body, createWriteStream(filePath));
    // push if succ
    catalog.push({ url: `images/${genre}/${i}.jpg` });
  };

  await Promise.all(
    ImgUrls.map(async (imgUrl, i) => {
      try {
        await fetchImage(imgUrl, i); //retry(fetchImage.bind(null, imgUrl, i));
      } catch (e) {
        console.error(`Error downloading ${imgUrl}: ${e.message}`);
      }
    })
  );

  writeFileSync(`./public/${genre}.json`, JSON.stringify(catalog, null, 2));
}

for (const category of categories) {
  fetchAndParse(category);
}
