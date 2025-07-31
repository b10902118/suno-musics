import { JSDOM } from "jsdom";
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from "fs";
import { mkdirSync, existsSync, createWriteStream } from "fs";
import { join } from "path";
import axios from "axios";

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

async function fetchAndParse(category) {
  const { genre, q } = category;
  const page = Math.floor(Math.random() * 151);
  const url = `https://pxhere.com/en/photos?q=${q}&order=popular&page=${page}&format=json`;

  const fetchPage = async (attempt = 0) => {
    console.log(`Attempt ${attempt + 1}: Fetching ${url}`);
    const data = await getWithTimeout(url);
    if (!data) {
      throw new Error("no data");
    }
    return data;
  };
  const json = await fetchPage(); // retry(fetchPage);

  const dom = new JSDOM(json.data);
  const images = [...dom.window.document.querySelectorAll("img")];
  const ImgUrls = images.map((img) => img.src);

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
    const data = await getWithTimeout(imgUrl, { responseType: "stream" });
    const filePath = join(dir, `${i}.jpg`); // assume all jpg
    data.pipe(createWriteStream(filePath));
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
