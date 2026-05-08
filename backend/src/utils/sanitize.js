const REGEX_META_CHARS = /[.*+?^${}()|[\]\/]/g;

export const escapeRegex = (str) => {
  if (typeof str !== "string") return "";
  if (str.length > 1000) throw new Error("Input too long");
  return str.replace(REGEX_META_CHARS, "\$&");
};

export const preventTraversal = (filePath) => {
  if (filePath.includes("..")) throw new Error("Path traversal detected");
  return filePath;
};
