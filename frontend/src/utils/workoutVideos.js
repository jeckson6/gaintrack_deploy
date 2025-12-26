export function getWorkoutVideoUrl(exercise) {
  const map = {
    squat: "https://www.youtube.com/embed/YaXPRqUwItQ",
    bench: "https://www.youtube.com/embed/gRVjAtPip0Y",
    deadlift: "https://www.youtube.com/embed/op9kVnSso6Q",
    pull: "https://www.youtube.com/embed/eGo4IYlbE5g",
    press: "https://www.youtube.com/embed/2yjwXTZQDDI",
    curl: "https://www.youtube.com/embed/ykJmrZ5v0Oo"
  };

  const key = Object.keys(map).find(k =>
    exercise.toLowerCase().includes(k)
  );

  return map[key] || "https://www.youtube.com/embed/U0bhE67HuDY";
}
