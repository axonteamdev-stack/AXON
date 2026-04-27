/**
 * Escape user-controlled strings for safe use in RegExp or MongoDB $regex.
 * Prevents ReDoS / unintended pattern expansion from metacharacters.
 */
export function escapeRegex(str) {
  if (str == null || typeof str !== "string") return "";
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
