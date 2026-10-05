"use strict";

const clock = document.getElementById("clock");
const pauseButton = document.getElementById("pause-button");
const syncButton = document.getElementById("sync-button");
const statusText = document.getElementById("clock-status");

// JavaScript задаёт начальные углы. Само вращение выполняет CSS.
function synchronizeClock() {
  clock.classList.add("is-resetting");
  const now = new Date();
  const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
  const minutes = now.getMinutes() + seconds / 60;
  const hours = (now.getHours() % 12) + minutes / 60;

  clock.querySelector(".second-hand").style.setProperty("--start", `${seconds * 6}deg`);
  clock.querySelector(".minute-hand").style.setProperty("--start", `${minutes * 6}deg`);
  clock.querySelector(".hour-hand").style.setProperty("--start", `${hours * 30}deg`);

  clock.classList.remove("is-paused");
  void clock.offsetWidth;
  clock.classList.remove("is-resetting");
  pauseButton.textContent = "Пауза";
  pauseButton.setAttribute("aria-pressed", "false");
  statusText.textContent = "Часы идут. Время установлено по вашему устройству.";
}

pauseButton.addEventListener("click", () => {
  const paused = clock.classList.toggle("is-paused");
  pauseButton.textContent = paused ? "Продолжить" : "Пауза";
  pauseButton.setAttribute("aria-pressed", String(paused));
  statusText.textContent = paused
    ? "Анимация стрелок приостановлена."
    : "Анимация продолжена. Для сверки времени нажмите «Текущее время».";
});

syncButton.addEventListener("click", synchronizeClock);
synchronizeClock();
