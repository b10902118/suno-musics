import fs from "fs";
import { compress, decompress } from "./compress";

const data = JSON.parse(fs.readFileSync("../public/man.json", "utf8"));

let maxLen = 0;
let maxUrl = "";
let maxCompressed = "";

data.forEach((item) => {
  if (item.origin) {
    const compressed = compress(item.origin);
    const decompressed = decompress(compressed);
    if (decompressed !== item.origin) {
      console.error(
        `Decompression mismatch:\n${item.origin}\n${decompressed}\n${compressed}`
      );
    }
    if (compressed.length > maxLen) {
      maxLen = compressed.length;
      maxUrl = item.origin;
      maxCompressed = compressed;
    }
  }
});

console.log("Max compressed length:", maxLen);
console.log("Origin with max compressed length:", maxUrl, maxCompressed);
