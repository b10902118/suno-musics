import { JSDOM } from "jsdom";
import { writeFileSync } from "fs";
import { mkdirSync, existsSync, createWriteStream } from "fs";
import { join } from "path";
import { pipeline } from "stream";
import { promisify } from "util";

const categories = [{ genre: "popular", q: "" }];

async function fetchAndParse(category) {
  let json;
  let attempt = 0;
  const { genre, q } = category;
  const page = Math.floor(Math.random() * 151);
  const url = `https://pxhere.com/en/photos?q=${q}&order=popular&page=${page}&format=json`;

  while (attempt < 3) {
    try {
      console.log(`Attempt ${attempt + 1}: Fetching ${url}`);
      const res = await fetch(url);
      json = await res.json();
      if (!json.data) {
        throw new Error("no data");
      }
      break; // Success
    } catch (err) {
      attempt++;
      if (attempt === 3) {
        throw new Error(`Failed after 3 attempts: ${err.message}`);
      }
    }
  }

  const dom = new JSDOM(json.data);
  const images = [...dom.window.document.querySelectorAll("img")];
  const ImgUrls = images.map((img) => img.src);

  const streamPipeline = promisify(pipeline);
  const dir = `./public/images/${genre}`;
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  const catalog = [];
  await Promise.all(
    ImgUrls.map(async (imgUrl, i) => {
      try {
        const res = await fetch(imgUrl);
        if (!res.ok) throw new Error(`Failed to fetch image: ${imgUrl}`);
        const filePath = join(dir, `${i}.jpg`); // assume all jpg
        await streamPipeline(res.body, createWriteStream(filePath));
        // push if succ
        catalog.push({ url: `images/${genre}/${i}.jpg` });
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
