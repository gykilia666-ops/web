"use strict";

(() => {
  const form = document.querySelector("#profile-form");
  const status = document.querySelector("#profile-status");
  const result = document.querySelector("#profile-result");
  const summary = document.querySelector("#profile-summary");
  const names = ["name", "email", "phone", "education", "gender", "about"];
  let attempted = false;
  const educationLabels = {
    basic: "Основное общее", secondary: "Среднее общее",
    vocational: "Среднее профессиональное", higher: "Высшее"
  };
  const hobbyLabels = {
    reading: "Чтение", sport: "Спорт", music: "Музыка",
    travel: "Путешествия", programming: "Программирование"
  };
  const controls = name => [...form.querySelectorAll(`[name="${name}"]`)];

  function getError(name) {
    const value = String(new FormData(form).get(name) || "").trim();
    switch (name) {
      case "name":
        if (!value) return "Введите имя.";
        if (value.length < 2 || value.length > 100) return "Введите имя длиной от 2 до 100 символов.";
        if (!/^[\p{L}\p{M}]+(?:[ '’\-][\p{L}\p{M}]+)*$/u.test(value)) {
          return "Используйте буквы; между частями имени допустимы пробел, дефис и апостроф.";
        }
        return "";
      case "email":
        if (!value) return "Введите email.";
        return value.length <= 254 && /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(value)
          ? "" : "Введите email в формате name@example.com.";
      case "phone": {
        if (!value) return "Введите телефон.";
        const digits = value.replace(/\D/g, "");
        return /^\+?[0-9 ()-]+$/.test(value) && digits.length >= 10 && digits.length <= 15
          ? "" : "Введите от 10 до 15 цифр. Плюс допускается только в начале, также разрешены пробелы, скобки и дефисы.";
      }
      case "education":
        return Object.hasOwn(educationLabels, value) ? "" : "Выберите образование.";
      case "gender":
        return ["male", "female"].includes(value) ? "" : "Укажите пол.";
      case "about":
        return value.length > 1000 ? "Сократите текст до 1000 символов." : "";
      default: return "";
    }
  }

  function validate(name) {
    const error = getError(name);
    document.getElementById(`${name}-error`).textContent = error;
    controls(name).forEach(control => {
      if (error) control.setAttribute("aria-invalid", "true");
      else control.removeAttribute("aria-invalid");
    });
    return !error;
  }

  function resetErrors() {
    form.querySelectorAll(".field-error").forEach(element => { element.textContent = ""; });
    form.querySelectorAll("[aria-invalid]").forEach(element => element.removeAttribute("aria-invalid"));
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    attempted = true;
    const invalid = names.filter(name => !validate(name));
    if (invalid.length) {
      result.hidden = true;
      status.dataset.state = "error";
      status.textContent = `Исправьте ошибки. Полей с ошибками: ${invalid.length}.`;
      controls(invalid[0])[0].focus();
      return;
    }
    const data = new FormData(form);
    const value = name => String(data.get(name) || "").trim();
    const rows = [
      ["Имя", value("name")], ["Email", value("email")], ["Телефон", value("phone")],
      ["Образование", educationLabels[value("education")]],
      ["Пол", value("gender") === "male" ? "Мужской" : "Женский"],
      ["Хобби", data.getAll("hobbies").map(item => hobbyLabels[item]).filter(Boolean).join(", ") || "Не выбраны"],
      ["О себе", value("about") || "Не указано"]
    ];
    // Сбрасываем форму до вывода результата, чтобы reset не скрыл новые данные.
    form.reset();
    rows.forEach(([title, text]) => {
      const dt = document.createElement("dt");
      const dd = document.createElement("dd");
      dt.textContent = title;
      dd.textContent = text;
      summary.append(dt, dd);
    });
    status.dataset.state = "success";
    status.textContent = "Анкета заполнена корректно. Данные выведены ниже, поля очищены.";
    result.hidden = false;
    result.focus();
  });

  function handleEdit(event) {
    if (attempted && names.includes(event.target.name)) validate(event.target.name);
    result.hidden = true;
    status.textContent = "";
    delete status.dataset.state;
  }
  form.addEventListener("input", handleEdit);
  form.addEventListener("change", handleEdit);
  form.addEventListener("reset", () => {
    attempted = false;
    resetErrors();
    status.textContent = "";
    delete status.dataset.state;
    result.hidden = true;
    summary.replaceChildren();
  });
})();
