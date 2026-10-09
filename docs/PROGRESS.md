# Ledger — plan: docs/PLAN.md

2026-10-09: plan zatwierdzony do wykonania przez użytkownika.

Ruling: praca bez git worktree — folder jest nowy i nie ma repozytorium Git; nie ma istniejącej gałęzi do izolowania. Repozytorium i publikacja są osobnym etapem zgodnie z planem.

Pre-flight: lekcje, zadania i mapa wymagań współdzielą stabilne identyfikatory; modele symulatorów nie zależą od UI. Schemat źródłowy i własny wariant treningowy mają oddzielne opisy semantyki STOP.

Ruling: stosujemy zaakceptowane Astro zamiast startera Sites, hosting przygotowany wyłącznie dla GitHub Pages. Brak rejestracji projektu w Sites.

2026-10-09: treść 16 lekcji, 32 zadania, 19 grup wymagań; kompilator 0 błędów/ostrzeżeń. Kontrola treści wykryła 9 bloków na najdłuższej ścieżce własnego LOGO; redukcja warunku START daje 28 bloków i limit 7. Odnotowano E09. Nie dodano jeszcze symulatorów.

Task 1: complete — kontrola treści przed symulatorami: 16 lekcji, 32 pełne zadania, 19 grup wymagań, 9 korekt. Odczyt wszystkich 49 stron instrukcji i porównanie kluczowych rysunków z geometrią, pinoutami i dokumentacją Siemens. scripts/audit-content.mjs: 8/8 algebra, oba zestawy zderzaków, 12 kości TTL, 28 bloków LOGO/ścieżka 7. astro build: 28 stron, sukces. Kontrola modeli i UI nastąpi przy każdym kolejnym module; wyniki nie oznaczają uruchomienia fizycznego stanowiska.

Task 2: complete — stanowisko/cykl: Vitest 4/4 RED→GREEN; Playwright 1/1. Ruch, pauza, krok, powrotne czujniki, STOP i trzymany START. Błąd runtime dev React po zmianach konfiguracji usunięty przez restart podglądu w development, następnie powtórzony test UI.

Task 3: complete — zderzaki: Vitest 3/3 RED→GREEN (łącznie 7/7), Playwright 2/2. Współrzędne, znak ruchu, oba wzorcowe zestawy, niepoprawne wejścia.

Task 4: complete — przekaźniki: Vitest 5/5 RED→GREEN, Playwright przypadek podtrzymania i faz 1/1. Dekoder sprawdzony dla wszystkich 16 kombinacji pamięci faz, pełny ślad i blokady kierunków.

Task 5: complete — bramki/NAND: Vitest 5/5 RED→GREEN, Playwright 1/1. Wszystkie tablice GF, 8 wierszy SOP/POS/NAND, 2048 kombinacji wzbudzania fizycznej sieci TTL, pełny cykl i zakaz SR=11.

Task 6: complete — pamięć SR/RS: Vitest 4/4 RED→GREEN, Playwright 1/1. Podtrzymanie, 11, równoczesne i kolejne zwolnienie, nieznany stan i priorytet R LOGO.

Task 7: complete — LOGO: Vitest 8/8 RED→GREEN, łącznie 29/29; Playwright panel/cykl/STOP 1/1. Walidator: 28 bloków, ścieżka 7, pamięć 5/6/8; wykrywa ?, I7, pętle, 31 bloków i ścieżkę 8. SF: TON, TOF, generator, impulsowy, załączenie z pamięcią, licznik; RS porównany w module pamięci; zegar na przykładzie pn–pt.

Task 8: in progress — 11 testów UI; pierwsza seria 10/11, jedyny błąd w oczekiwanej wielkości litery tytułu w teście. Poprawiony test bez JS/wydruku 1/1. Widok desktop/telefon i dialog schematu obejrzane. Cache Vite rozdzielony między dev i build, aby kontrole nie nadpisywały runtime podglądu. Przygotowano workflow z kontrolami i publikacją wyłącznie na późniejsze ręczne wywołanie.

Final: przegląd niezależny zakończony — brak Critical. Important: przewód przez otwarty START; potwierdzono i poprawiono. R07 oraz cyklogram, pierwotnie Minor, potraktowano jako istotne błędy dydaktyczne: uczą odwrotnego pierwszeństwa sprzęgieł i błędnych oznaczeń. Poprawiono zgodnie z nadrzędnym żądaniem użytkownika skorygowania każdej rozbieżności; własne równania i legenda potwierdzają wersję poprawioną. E10–E12. Nie pozostawiono odroczonych uwag.

Final: fixed droga zasilania — test UI Przekaźnik: START podtrzymuje, STOP przerywa drogę RED→GREEN. Osobne gałęzie START i K, przerwy w stykach i poprawne kolory.

Final: fixed wydruk bez JavaScript — dodatkową wątpliwość odtworzono: odpowiedzi ukryte. Test UI treść działa bez JavaScript; wydruk otwiera wszystkie rozwiązania RED→GREEN. Strona drukowania ma expanded w HTML, E13.

Task 8: complete — pnpm check: 55 plików, 0 errors/warnings/hints; treść 16/32/19/13. pnpm test: 31/31 w 7 plikach. SITE_BASE=/SMATR pnpm build: 28 stron. pnpm check:build: 1152 odnośników/zasobów/kotwic poprawnych. Produkcyjne pnpm test:e2e: 11/11. Kontrola wizualna wszystkich 49 stron wydruku A4 i widoków desktop/telefon; brak pustych stron i przycięć. docs/REPORT.md opisuje wykonane kontrole i granice wyniku. Brak oryginałów i hasła w dist.

Finish: zatwierdzony zakres kończy się na kompletnym kodzie i przygotowaniu GitHub Pages. Zachowano projekt w katalogu użytkownika; brak gałęzi/worktree do integrowania i usuwania. Bez publikacji, push ani tworzenia repozytorium.
