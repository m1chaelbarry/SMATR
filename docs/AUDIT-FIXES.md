# Poprawki audytu — 10 października 2026

- Pamięć LOGO: RS 0/1/0, licznik 2/2/0; dwa RS i trzy liczniki zajmują 6/8/0, przy limitach 27/24/10 (Siemens LOGO! Manual 1997, s. 163). Model, lekcja i test regresji mają zgodny wynik. Historyczne podsumowania pamięci zostały skorygowane.
- Rysunek K1 w symulatorze przekaźników oznaczono jako skrót. A zawiera START, 1ŁD i brak aktywnej fazy; gałąź startowa uwzględnia K5. Pełny schemat w lekcji pozostaje punktem odniesienia.
- Trening i wydruk zawierają trzy samodzielne projekty: 60–90–150, 120–80–160 i 150–70–110 mm. Każdy ma inne prędkości faz, polecenia od faz po schemat oraz ukryte rozwiązanie funkcjonalne.
- Lekcja pełnego cyklu TTL udostępnia siódmy symulator: ręczne czujniki, START/STOP, K1–K5, S/R przed i po ustaleniu oraz wyjścia napędu. Zabronione SR blokuje ćwiczenie do resetu.
- Funkcje LOGO mają historię Trg/R/Q z osią czasu, próbkowaniem do 10 ms i przejściami na końcu T. Wykres obejmuje m.in. TON, TOF i załączenie z pamięcią; zmiana funkcji lub reset zaczyna nową historię.
- Wydruk nadaje ID osobno każdej lekcji na serwerze, zachowuje odwołania do nagłówków i markerów SVG i działa bez JavaScript. Powiększenie schematu również zmienia ID kopii. Kontrola budowy wykrywa powtórzone ID.

## Weryfikacja lokalna

Instalacja zależności została zablokowana przez dostęp sieciowy środowiska. Wszystkie 37 przypadków z 10 plików testów modeli/danych wykonano w Node 24 przy użyciu tymczasowego adaptera podstawowych asercji Vitest. To nie jest uruchomienie Vitest. Adapter pozostaje poza repozytorium. Test pamięci odtworzył błędne 5/6/8 przed poprawką i potwierdził 6/8/0 po poprawce.

`node scripts/check-content.mjs`, `node scripts/audit-content.mjs` i `git diff --check` przeszły. Przegląd kodu nie znalazł istotnych błędów w nowych modelach/widokach.

Pełne `pnpm check`, `pnpm test`, build i Playwright muszą zostać wykonane przez istniejący workflow GitHub dla PR. Dodano testy przeglądarkowe pełnego TTL, funkcji czasowych, projektów bez JavaScript, unikalnych ID i szerokości telefonu 390×844. Lokalne wyniki nie potwierdzają jeszcze wyglądu telefonu ani kompilacji Astro/React.
