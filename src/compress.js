function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (match, char) => char.toUpperCase());
}

function camelToSnake(str) {
  return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

const bigrams = ["th", "he", "in", "en", "nt", "re", "er", "an", "ti", "es"];

const prefix = "https://c.pxhere.com/photos/";
const suffix = ".jpg!s1";

function replaceBigrams(str) {
  let compressed = str;
  bigrams.forEach((bigram, index) => {
    compressed = compressed.replace(new RegExp(bigram, "g"), String(index));
  });
  return compressed;
}

export function compress(url) {
  let stripped = url;

  if (!stripped.startsWith(prefix) || !stripped.endsWith(suffix)) {
    return url;
  }
  stripped = stripped.slice(prefix.length).slice(0, -suffix.length);
  const hex = stripped.slice(0, 2) + stripped.slice(3, 5);
  stripped = stripped.slice(6);

  const camel = snakeToCamel(stripped);

  return hex + replaceBigrams(camel);
  // other tricks:
  // 1. top beginning Camel and more bigrams
  // 2. suffix decimal to 0+26+26-ary
}

export function decompress(compressed) {
  if (compressed.startsWith("http")) return compressed;

  const parts = compressed.split("-");
  const hash = parts.length >= 2 ? parts.pop() : ""; // prevent no hash
  const hexName = parts.join("-");
  const hexPath = `${hexName.slice(0, 2)}/${hexName.slice(2, 4)}/`;
  let filename = hexName.slice(4);

  bigrams.forEach((bigram, index) => {
    filename = filename.replace(new RegExp(String(index), "g"), bigram);
  });
  filename = camelToSnake(filename);
  const main = hexPath + filename + (hash ? `-${hash}` : "");
  return `${prefix}${main}${suffix}`;
}
