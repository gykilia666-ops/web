"use strict";
const form = document.querySelector("#car-form");
const year = document.querySelector("#year");
const fuel = document.querySelector("#fuel");
const engine = document.querySelector("#engine");
const engineField = document.querySelector("#engine-field");
const phone = document.querySelector("#phone");
const photos = document.querySelector("#photos");
const photosStatus = document.querySelector("#photos-status");
const duration = document.querySelector("#duration");
const durationValue = document.querySelector("#duration-value");
const result = document.querySelector("#result");
const summary = document.querySelector("#summary");
const status = document.querySelector("#form-status");
const now = new Date();
year.max = String(now.getFullYear() + 1);
const localDate = [now.getFullYear(), String(now.getMonth()+1).padStart(2,"0"), String(now.getDate()).padStart(2,"0")].join("-");
document.querySelector("#inspection").min = localDate;
function updateEngine() {
  const electric = fuel.value === "Электро";
  engineField.hidden = electric;
  engine.disabled = electric;
  engine.required = !electric;
}
function validatePhone() {
  const value = phone.value.trim();
  const digits = value.replace(/\D/g, "");
  const valid = /^[+\d\s()-]+$/.test(value) && digits.length >= 10 && digits.length <= 15;
  phone.setCustomValidity(value && !valid ? "Введите телефон: от 10 до 15 цифр, без букв." : "");
}
function validatePhotos() {
  const files = Array.from(photos.files);
  let error = "";
  if (files.length > 5) error = "Можно выбрать не более 5 фотографий.";
  else if (files.some(f => !["image/jpeg", "image/png", "image/webp"].includes(f.type))) error = "Разрешены только JPEG, PNG и WebP.";
  else if (files.some(f => f.size > 5 * 1024 * 1024)) error = "Каждый файл должен быть не больше 5 МБ.";
  photos.setCustomValidity(error);
  photosStatus.textContent = error || (files.length ? `Выбрано файлов: ${files.length}. ${files.map(f => f.name).join(", ")}` : "Файлы не выбраны.");
}
fuel.addEventListener("change", updateEngine);
phone.addEventListener("input", validatePhone);
photos.addEventListener("change", validatePhotos);
duration.addEventListener("input", () => { durationValue.value = `${duration.value} дн.`; });
document.querySelector("#vin").addEventListener("input", e => { e.target.value = e.target.value.toUpperCase(); });
form.addEventListener("input", () => {
  if (!result.hidden) { result.hidden = true; status.textContent = "Данные изменены. Повторите проверку объявления."; }
});
form.addEventListener("change", () => {
  if (!result.hidden) { result.hidden = true; status.textContent = "Данные изменены. Повторите проверку объявления."; }
});
form.addEventListener("submit", event => {
  event.preventDefault();
  validatePhone();
  validatePhotos();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const money = new Intl.NumberFormat("ru-RU").format(Number(data.get("price")));
  const rows = [
    ["Автомобиль", `${data.get("brand")} ${data.get("model")}, ${data.get("year")} г.`],
    ["Кузов и цвет", `${data.get("body_type")}, ${data.get("color")}`],
    ["Пробег", `${new Intl.NumberFormat("ru-RU").format(Number(data.get("mileage")))} км`],
    ["Двигатель", `${data.get("fuel")}${engine.disabled ? "" : `, ${data.get("engine")} л`}`],
    ["Коробка передач", data.get("transmission")],
    ["Состояние", data.get("condition")],
    ["VIN", data.get("vin") || "Не указан"],
    ["Цена", `${money} ₽`],
    ["Город", data.get("city")],
    ["Описание", data.get("description")],
    ["Готовность к осмотру", data.get("inspection") || "По договорённости"],
    ["Видео", data.get("video") || "Не указано"],
    ["Фотографии", photos.files.length ? Array.from(photos.files).map(f => f.name).join(", ") : "Не выбраны"],
    ["Срок объявления", `${data.get("duration")} дн.`],
    ["Дополнительно", data.getAll("features").join(", ") || "Не указано"],
    ["Продавец", data.get("seller_name")],
    ["Контакты", `${data.get("phone")}; ${data.get("email")}`]
  ];
  summary.replaceChildren();
  rows.forEach(([title, value]) => {
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = title;
    dd.textContent = String(value);
    summary.append(dt, dd);
  });
  result.hidden = false;
  status.textContent = "Форма заполнена корректно. Предпросмотр создан, отправки на сервер нет.";
  result.focus();
});
form.addEventListener("reset", () => {
  result.hidden = true;
  summary.replaceChildren();
  status.textContent = "";
  phone.setCustomValidity("");
  photos.setCustomValidity("");
  setTimeout(() => {
    updateEngine();
    durationValue.value = `${duration.value} дн.`;
    photosStatus.textContent = "Файлы не выбраны.";
  }, 0);
});
updateEngine();
