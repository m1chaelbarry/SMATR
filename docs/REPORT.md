# Raport odbioru SMATR

Data: 9 października 2026. Weryfikowana wersja: kod w tym katalogu, produkcyjna budowa z `SITE_BASE=/SMATR`, podgląd `http://127.0.0.1:4322/SMATR/`.

## Dostarczony zakres

16 lekcji w czterech częściach, 32 zadania (po osiem) z podpowiedziami, rozwiązaniami i uzasadnieniami; sześć prowadzonych symulatorów. Osobne strony: trening, powtórka i przygotowanie do laboratoriów, słownik, mapa wymagań, źródła/korekty oraz cały podręcznik do wydruku. Astro generuje 28 stron HTML. React uruchamia interakcję przy właściwej lekcji; tekst, wzory i odpowiedzi działają bez JavaScript.

Każda lekcja ma identyfikator, cel, zastosowanie na stanowisku, wyjaśnienia, rozwiązany przykład, pytania/zadania, typowy błąd, powtórkę i strony źródłowe. Mapa zawiera 19 grup wymagań oraz relację wymaganie → lekcja → przykład → zadania → sprawdzenie. Pełny wariant 100–120–100 mm i szybki powrót ma tabelę faz, pamięć, warunki przejść, schematy i ślad trzech realizacji. Przy TTL podano wszystkie bramki i nóżki; przy LOGO wszystkie bloki, wejścia/wyjścia oraz limity.

Kolejność realizacji zachowano: treść i własny audyt → stanowisko/cykl → zderzaki → przekaźniki → bramki/NAND → SR/RS → LOGO. Każdy model i główne ćwiczenie sprawdzono przed następnym modułem.

## Źródła i rozbieżności

Przeczytano wszystkie 49 stron trzech instrukcji (17 + 12 + 20) oraz oba teksty pomocnicze. Kluczowe rysunki, tablice i schematy obejrzano po renderowaniu. Instrukcje mają pierwszeństwo wobec tekstów pomocniczych; ich potwierdzone błędy oznaczono jako erraty. Dokumentacja producenta: [Siemens LOGO! Manual 1997](https://cache.industry.siemens.com/dl/files/345/19624345/att_68381/v1/logo_e_97.pdf).

Rejestr na stronie `/zrodla/` oraz w wydruku ma 13 wpisów, każdy z pierwotnym twierdzeniem, korektą, źródłem, uzasadnieniem i wpływem:

| Wpis | Wynik |
|---|---|
| E01 | TTL s. 12: zera 0, 1, 4, 6; iloczyn sum poprawny. |
| E02 | Uzupełniono wszystkie osiem SF LOGO. |
| E03 | Poprawiono zamienione symbole dwóch ostatnich SF i nazwę załączenia z pamięcią. |
| E04 | Oddzielono NOR SR z zabronionym 11 od LOGO RS z priorytetem R. |
| E05 | Ujednolicono I1–I6; J w tekście źródłowym jest aliasem. |
| E06 | Wyprowadzono geometrię z rys. 7: oba wymagane zestawy odstępów. |
| E07 | Źródłowy STOP w obwodzie 3S odróżniono od własnego STOP kasującego cykl. |
| E08 | Zastąpiono deklaracje wcześniejszego sprawdzenia wynikami poniższych kontroli. |
| E09 | Własny projekt LOGO poprawiono z wykrytej ścieżki 9 do 28 bloków i ścieżki 7. |
| E10 | R07: podczas nakładania K2/K3 pierwszeństwo ma 2E; potem następuje 1E. |
| E11 | Na stronie głównej linia ciągła oznacza F1/F3, przerywana F2/F4. |
| E12 | Podświetlenie podtrzymania nie prowadzi już przewodu przez otwarty START. |
| E13 | Wydruk zawiera odpowiedzi i podpowiedzi także bez JavaScript. |

E09–E13 dotyczą błędów własnego projektu wykrytych i poprawionych w tej realizacji. Pozostałe wpisy rozróżniają erraty instrukcji od uzupełnień materiałów pomocniczych.

## Wykonane kontrole

Wszystkie poniższe wyniki dotyczą końcowego kodu po poprawkach przeglądu.

| Kontrola | Wynik i zakres |
|---|---|
| `pnpm check` | 55 plików: 0 błędów, 0 ostrzeżeń, 0 wskazówek TypeScript/Astro. Struktura: 16 lekcji, 32 kompletne zadania, 19 grup wymagań, 13 korekt. |
| `scripts/audit-content.mjs` | 8/8 wierszy SOP=POS=NAND. Geometria 155–175–155 i 135–195–115 mm. TTL: 30 NAND + 5 SR w 12 kościach, bez kolizji wejść. LOGO: 28 bloków, acykliczna sieć B, maksimum 7 na ścieżce. |
| `pnpm test` | **31/31**, 7 plików Vitest. Wszystkie sześć modeli oraz fizyczne połączenia przekaźników i TTL. |
| `SITE_BASE=/SMATR pnpm build` | Sukces, 28 statycznych stron HTML. |
| `SITE_BASE=/SMATR pnpm check:build` | **1152/1152** lokalnych odnośników, zasobów i kotwic istnieje oraz zachowuje bazę `/SMATR/`. Sprawdzono także fonty wskazane przez CSS. |
| Produkcyjne `pnpm test:e2e` | **11/11**, Playwright w Edge/Chromium na Windows, adres `http://127.0.0.1:4322/SMATR/`. |
| Ochrona roboczych źródeł | W `dist/` brak oryginalnych PDF-ów, hasła i ścieżek prywatnych załączników. |

Vitest obejmuje: granice ruchu i łączniki podczas powrotu, deterministyczny duży krok, START trzymany po końcu cyklu, STOP i ponowne zezwolenie; dwa zestawy geometrii i błędne dane; samopodtrzymanie, blokady i wszystkie 16 kombinacji faz; wszystkie tablice bramek, osiem wierszy przykładu oraz **2048 kombinacji** funkcji wzbudzania TTL. Osobno sprawdzono osiągalność cewek w fizycznej sieci kontaktów dla 2048 kombinacji i przypisania nóżek TTL. Sprawdzono zabronione SR=11, zwolnienie równoczesne i sekwencyjne oraz priorytet R LOGO.

Testy LOGO sprawdzają pełny cykl, powrotne łączniki bez ponownego zliczania, przytrzymany START, zatrzymanie programu i brak pracy w STOP; timery, generator, przełącznik impulsowy, załączenie z pamięcią, licznik, przykład zegara tygodniowego oraz naprawę `?`. Walidator wykrywa niekompletne połączenia, I7, pętle, przekroczenie 30 bloków i ścieżki siedmiu. Program wykorzystuje 2 RS i 3 liczniki, zajętość trzech obszarów pamięci 5/6/8 przy limitach 27/24/10.

Testy UI obejmują główne ćwiczenie każdego symulatora, lokalną nawigację, 32 zadania, START/STOP, gałęzie drogi zasilania, wskazanie wiersza prawdy, stan nieznany SR, naprawę LOGO, pełny cykl i otwarte wyjścia w STOP. Dodatkowo: telefon 390×844, pulpit 1440×1000, brak poziomego przewijania całej strony, rozwijany spis lekcji, dialog powiększenia SVG, Escape, klawiatura i odnośnik pominięcia nawigacji, ograniczenie animacji, treść i KaTeX bez skryptów, 32 widoczne rozwiązania i podpowiedzi w wydruku bez JavaScript oraz brak błędów zasobów i runtime w sprawdzanych widokach.

## Kontrola wizualna i przegląd

Obejrzano zapisane widoki pulpitu, telefonu, stanowiska i LOGO. Do kontroli druku wytworzono wyłącznie roboczy plik w ignorowanym `.cache/qa/`; nie jest osobnym materiałem użytkownika. Końcowy wydruk A4 ma **49 stron**, w tym przygotowanie do laboratoriów, słownik i korekty. Obejrzano podglądy wszystkich stron: brak pustych stron, nakładania tekstu lub przyciętych tabel i schematów. Rozwiązania są rozwinięte w HTML strony druku.

Przeprowadzono jeden niezależny przegląd całego projektu. Nie wykazał błędów krytycznych. Potwierdził obliczenia, przypisania TTL, ograniczenia LOGO i ciąg wyjść wspólnego cyklu `1010 → 1001 → 1010 → 0101 → 0000`, również między ustalonymi fazami. Zgłoszone błędy rysunku styku, odpowiedzi R07 i cyklogramu usunięto. Dodatkową wątpliwość dotyczącą druku bez JS odtworzono testem, następnie usunięto. Regresje podtrzymania i wydruku miały przebieg RED→GREEN, po czym cała seria przeszła. Nie pozostawiono odroczonych usterek z przeglądu.

## Przygotowanie do publikacji i granice wyniku

Kod i lockfile są kompletne. Instrukcje uruchomienia znajdują się w `README.md`. GitHub Actions wykonuje kontrolę, testy, budowę, sprawdzenie odnośników i testy UI przed możliwością publikacji. Ścieżkę wyprowadza z nazwy repozytorium; późniejszy deploy wymaga ręcznego `publish=true` na gałęzi domyślnej oraz ustawienia Pages na GitHub Actions. Workflow jest przygotowany; nie wykonywano go na GitHub. Repozytorium i publikacja należą do osobnego etapu, zgodnie z planem użytkownika.

Modele opisują idealne sygnały i jawne uproszczenia: umowne prędkości, brak fizycznych hazardów, opóźnień i drgań styków. LOGO ma dydaktyczny krok 50 ms i opisany sposób odczytu poprzednich Q; nie emuluje w pełni firmware. Zegar SF ma prowadzony przykład pn–pt 8:00–13:00, bez edytora własnego harmonogramu. Panel prowadzi przez wybrany program i naprawę, bez edytora dowolnych układów. Nie przeprowadzano pomiarów stanowiska, prób elektrycznych ani uruchomienia rzeczywistego LOGO. Testy lokalne korzystały z Edge na Windows; CI przewiduje Chromium na Linux, ale ta seria nie została jeszcze wykonana zdalnie.
