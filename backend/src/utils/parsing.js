export const safeParse = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return [data];
  }
};
