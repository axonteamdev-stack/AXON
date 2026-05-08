export const parseTime = (timeStr) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours < 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
};

export const formatTime = (h, m) => {
  const modifier = h >= 12 ? "PM" : "AM";
  const hours = h % 12 || 12;
  const minutes = m < 10 ? `0${m}` : m;
  return `${hours}:${minutes} ${modifier}`;
};

export const generateIntakeTimes = (firstTime, frequency) => {
  const { hours, minutes } = parseTime(firstTime);
  const times = [firstTime];
  const intervals = { "twice daily": 12, "three times daily": 8 };
  const interval = intervals[frequency];

  if (interval) {
    for (let i = 1; i < 24 / interval; i++) {
      times.push(formatTime((hours + interval * i) % 24, minutes));
    }
  }
  return times;
};

export const getTodayString = () => new Date().toISOString().split("T")[0];
