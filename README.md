# SMATR — podręcznik i sześć prowadzonych symulatorów

Polskie materiały do laboratoriów JBD-320: 16 lekcji MDX, 32 zadania z rozwiązaniami, mapa wymagań oraz rejestr korekt. Astro generuje osobne strony HTML, React uruchamia tylko symulator w danej lekcji. Wzory: KaTeX; schematy: SVG. Treść i rozwiązania są dostępne bez JavaScript. Cały podręcznik można wydrukować ze strony `/druk/`.

## Uruchomienie

Wymagane Node.js 24+ i pnpm 11.25.0. W katalogu projektu:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Podgląd: `http://127.0.0.1:4321/`. Zatrzymanie serwera: Ctrl+C. Dla testów UI utrzymuj uruchomiony serwer. Lokalnie Playwright używa zainstalowanego Edge na Windows, jeśli jest dostępny; na innych systemach zainstaluj przeglądarkę przez `pnpm exec playwright install chromium`. Zmienna `PW_EXE` pozwala wskazać własny plik wykonywalny.

```sh
pnpm check
pnpm test
pnpm test:e2e
pnpm build
pnpm check:build
pnpm preview --port 4322
```

`check` obejmuje TypeScript, strukturę treści, algebraiczne obliczenia i limity projektów. `test` sprawdza modele Vitest, `test:e2e` ćwiczenia, nawigację, telefon, klawiaturę i wydruk. Budowa zapisuje gotową stronę w `dist/`; `check:build` sprawdza jej odnośniki, kotwice i zasoby. Uruchamiaj ją z tym samym `SITE_BASE` co budowę.

## Kontrola ścieżki repozytorium

W PowerShell:

```powershell
$env:SITE_BASE='/SMATR'
pnpm build
pnpm preview --port 4322
```

W drugim terminalu:

```powershell
$env:E2E_URL='http://127.0.0.1:4322/SMATR/'
pnpm test:e2e
```

Po próbie usuń zmienne lokalne: `Remove-Item Env:SITE_BASE, Env:E2E_URL -ErrorAction SilentlyContinue`. W bash użyj `SITE_BASE=/SMATR pnpm build` i `E2E_URL=http://127.0.0.1:4322/SMATR/ pnpm test:e2e`. `SITE_URL` wskazuje domenę bez ścieżki; `SITE_BASE` ścieżkę z początkowym ukośnikiem. Bez tych zmiennych Astro wyprowadza wartości z `GITHUB_REPOSITORY`. Repozytorium `owner.github.io` używa `/`.

## Przygotowanie GitHub Pages

Docelowe repozytorium: `m1chaelbarry/SMATR`, strona: `https://m1chaelbarry.github.io/SMATR/`. Status pierwszej publikacji opisuje `docs/DEPLOYMENT.md`. Workflow `.github/workflows/pages.yml` uruchamia kontrolę, testy i budowę przy push oraz pull request do `main`. Buduje i testuje właściwą ścieżkę repozytorium. Push do `main` publikuje dopiero po przejściu wszystkich kontroli. Można także ręcznie uruchomić workflow z `publish=true` na gałęzi domyślnej. Wymagane ustawienie **Settings → Pages → Source: GitHub Actions**.

Przesyłaj kod, konfigurację i `pnpm-lock.yaml`. Nie przesyłaj `.cache/`, `node_modules/`, roboczych załączników ani hasła. Publikowany artefakt obejmuje wyłącznie `dist/`. Workflow nie wymaga prywatnych materiałów źródłowych.

Konfiguracja opiera się na [dokumentacji Astro dla Pages](https://docs.astro.build/en/guides/deploy/github/) i [dokumentacji GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Organizacja

- `src/content/lessons/` — lekcje, cele, kolejność, strony źródeł i identyfikatory zadań.
- `src/data/` — zadania, korekty, mapa wymagań, połączenia TTL/LOGO i montaż przekaźników.
- `src/models/` — czysta, deterministyczna logika sześciu modułów.
- `src/components/sim/` — obsługa i wizualizacje React.
- `tests/`, `e2e/` — testy obliczeń i przeglądarki.
- `docs/PLAN.md`, `docs/PROGRESS.md`, `docs/REPORT.md` — plan, ślad realizacji i raport kontroli.

Modele mają idealne sygnały i jawnie opisane uproszczenia. Krok LOGO 50 ms i prędkości 20/80 mm/s są umowne. Schemat źródłowy przekaźników ma inne umiejscowienie STOP niż własny wariant fazowy. LOGO używa 28 bloków, sześciu wejść, czterech wyjść i maksymalnie siedmiu bloków na ścieżce. Wyniki symulacji nie zastępują obserwacji rzeczywistego stanowiska.
