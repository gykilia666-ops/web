#!/usr/bin/env python3
"""Загружает сторонние ресурсы для последующего локального использования."""

from pathlib import Path
from urllib.error import URLError
from urllib.request import Request, urlopen
import sys


ROOT = Path(__file__).resolve().parent

RESOURCES = (
    (
        "https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.css",
        ROOT / "assets" / "normalize.css",
    ),
    (
        "https://raw.githubusercontent.com/google/fonts/main/"
        "ofl/oswald/Oswald%5Bwght%5D.ttf",
        ROOT / "assets" / "fonts" / "Oswald.ttf",
    ),
    (
        "https://raw.githubusercontent.com/google/fonts/main/"
        "ofl/oswald/OFL.txt",
        ROOT / "assets" / "fonts" / "OFL.txt",
    ),
)


def download(url: str, destination: Path) -> None:
    if destination.is_file() and destination.stat().st_size > 0:
        print(f"Уже существует: {destination.relative_to(ROOT)}")
        return

    destination.parent.mkdir(parents=True, exist_ok=True)

    request = Request(
        url,
        headers={"User-Agent": "PHP-Article-Setup/1.0"},
    )

    with urlopen(request, timeout=60) as response:
        data = response.read()

    if not data:
        raise ValueError(f"Получен пустой файл: {url}")

    if destination.suffix == ".ttf":
        if data[:4] not in (b"\x00\x01\x00\x00", b"OTTO"):
            raise ValueError("Скачанный файл не распознан как шрифт.")

    temporary = destination.with_suffix(destination.suffix + ".part")
    temporary.write_bytes(data)
    temporary.replace(destination)

    print(f"Сохранено: {destination.relative_to(ROOT)}")


def main() -> int:
    try:
        for url, destination in RESOURCES:
            download(url, destination)
    except (OSError, URLError, ValueError) as error:
        print(f"Ошибка подготовки: {error}", file=sys.stderr)
        print(
            "Проверьте подключение к интернету и запустите скрипт повторно.",
            file=sys.stderr,
        )
        return 1

    print("\nГотово! Запустите: python -m http.server 8000")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())