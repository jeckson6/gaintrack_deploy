export function addToGoogleCalendar(day, exercises) {
  const text = encodeURIComponent(`Workout - ${day}`);
  const details = encodeURIComponent(exercises.join("\n"));

  const start = new Date();
  start.setDate(start.getDate() + 1);

  const startStr = start.toISOString().replace(/-|:|\.\d+/g, "");

  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&dates=${startStr}/${startStr}`;

  window.open(url, "_blank");
}
