# Publikacja SMATR w GitHub Pages

9 października 2026: użytkownik zlecił utworzenie nowego repozytorium, dodanie całego kodu i publikację strony.

Konto: `m1chaelbarry`. Utworzone publiczne repozytorium: `https://github.com/m1chaelbarry/SMATR`; adres strony: `https://m1chaelbarry.github.io/SMATR/`.

Konfiguracja: GitHub Pages korzysta z GitHub Actions; wymuszony HTTPS na domenie domyślnej. Utworzenie repozytorium i ustawienie Pages wykonano w zalogowanej sesji użytkownika. Kod przesyłany jest przez połączony konektor GitHub. Bieżący wynik weryfikacji i publikacji widać w [Actions](https://github.com/m1chaelbarry/SMATR/actions).

Workflow sprawdza treść, TypeScript, modele, produkcyjną budowę, odnośniki i UI, a po sukcesie publikuje push do `main`. Pull request uruchamia tylko weryfikację. Ręczne wywołanie z `publish=false` też służy samej weryfikacji. Ustawienie Pages → GitHub Actions jest zapisane.

Do repozytorium trafia kod źródłowy, testy, dokumentacja, konfiguracja i lockfile. Robocze załączniki, PDF-y, hasło, cache, zależności i wyniki lokalnych testów pozostają poza nim.

Raport `REPORT.md` dokumentuje kontrolę podręcznika przed zleceniem publikacji. Niniejszy plik śledzi osobny etap wdrożenia.
