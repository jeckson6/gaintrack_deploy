export function generateCalendarLink(trainingPlan) {
  if (!Array.isArray(trainingPlan) || trainingPlan.length === 0) {
    return "#";
  }

  const title = encodeURIComponent("Weekly Training Plan - GainTrack");

  const details = encodeURIComponent(
    trainingPlan
      .map(day => {
        return `${day.day} (${day.focus})\n${day.exercises.join("\n")}`;
      })
      .join("\n\n")
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`;
}