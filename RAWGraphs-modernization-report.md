# RAWGraphs — Report modernizzazione dipendenze

Stato al 2026-08-24. Copre tre repo: `rawgraphs-core`, `rawgraphs-charts`, `rawgraphs-app`.
Tutti i commit sono fatti a mano dal curatore dopo revisione, mai direttamente dall'assistente. Nessuna di queste modifiche è ancora stata pubblicata su npm.

---

## 1. Fasi completate e committate

### rawgraphs-app — branch `chore/vite-migration` (pushato)

**Migrazione da create-react-app a Vite 7.3.6**
CRA è stato archiviato da Meta a febbraio 2025 ed era il principale blocco a ulteriori aggiornamenti (webpack 4, Babel legacy). Vite è stata la scelta perché usa Rollup in produzione (stesso bundler già in uso per core/charts) e non richiede una migrazione successiva.

Problemi reali trovati e risolti durante la migrazione (non solo warning, bug che rompevano l'app):
- **JSX in file `.js`**: Vite/esbuild esclude `.js` dal transform JSX di default; serviva override esplicito in `vite.config.js`.
- **`process`/`global` non definiti**: alcune dipendenze (sparqljs, sparql-http-client, js-sha3) assumono un ambiente Node/webpack. Risolto con `define` in Vite + polyfill runtime in `index.html`.
- **Bug solo in produzione, non in dev**: il parser generato da sparqljs contiene codice morto (`require.main === module`) che in dev esbuild neutralizza automaticamente, ma in build di produzione (Rollup) lascia un riferimento a `require` non definito → crash al mount. Risolto con un polyfill mirato.
- **SPARQL query rotta**: `nodeify-fetch` (dipendenza di `sparql-http-client`) ha un bug nel suo patch per il browser — blocca lo stream della Response prima di leggerlo. Risolto passando il `fetch` nativo del browser invece di lasciare che la libreria usi il proprio.

> **In parole semplici**
>
> - *JSX in file `.js`*: il codice di RAWGraphs mescola HTML e JavaScript in file che finiscono in `.js`, mentre la convenzione più comune sarebbe chiamarli `.jsx`. Il nuovo strumento di build (Vite) per default si aspettava che i file `.js` fossero JavaScript "puro", quindi non capiva gran parte del codice dell'app finché non gli abbiamo detto esplicitamente "trattali come `.jsx` anche loro".
> - *`process`/`global` non definiti*: alcune librerie che l'app usa (per leggere query SPARQL, parlare con database) sono state scritte assumendo di girare su un server, dove certe informazioni "di sistema" sono sempre disponibili. Il vecchio strumento (webpack) forniva automaticamente delle finte versioni di queste informazioni anche nel browser; il nuovo (Vite) no, perché nel browser non hanno davvero senso. Abbiamo dovuto fornirle noi a mano, altrimenti quelle librerie andavano in errore appena provavano a leggerle.
> - *Bug solo in produzione*: dentro una delle librerie (sparqljs) c'è un pezzo di codice morto, pensato per essere eseguito solo se la libreria viene usata da riga di comando — nel browser non dovrebbe mai attivarsi. Durante lo sviluppo il nuovo strumento lo rendeva innocuo automaticamente, ma nella build "vera", quella che finisce online, no: quel codice si attivava e faceva bloccare l'intera app al primo caricamento. Il punto pericoloso di questo tipo di bug è che tutto sembra funzionare mentre si lavora, e si rompe solo per chi usa l'app pubblicata.
> - *SPARQL query rotta*: uno degli strumenti che RAWGraphs usa per scaricare dati da database SPARQL aveva un bug interno nel modo in cui si adattava per funzionare nel browser — iniziava a leggere la risposta del server, poi provava a rileggerla da capo, cosa che i browser non permettono (una risposta di rete si può leggere una volta sola). Risolto saltando quell'adattamento difettoso e usando il meccanismo nativo del browser per scaricare i dati.

**Fase 5 — pulizia warning a basso rischio** (commit separati, stesso branch)
- Font IBM Plex Mono non si risolvevano a build-time (path relativo non risolvibile da Vite attraverso la vecchia catena di `@import` Sass) → spostati in `public/fonts/` con path assoluto.
- Code-splitting del loader SPARQL (sparqljs + sparql-http-client + lit-html erano nel bundle principale anche se usati solo dalla tab SPARQL) → lazy-loading, bundle principale ridotto di ~469kB.

**Non toccato, deliberatamente**: i ~285 warning di deprecazione Sass e i warning `findDOMNode`/`defaultProps` di React vengono da Bootstrap 4 e react-bootstrap 1.x. Risolverli richiede Bootstrap 5 (breaking: niente jQuery, classi CSS diverse) — migrazione rimandata, valutata "alto rischio" rispetto al beneficio.

> **In parole semplici: perché React e Bootstrap non sono all'ultima versione**
>
> Non è una dimenticanza, è una scelta per limitare il rischio — portarli all'ultima versione richiederebbe riscrivere pezzi importanti dell'app, non solo cambiare un numero.
>
> **React** (siamo sulla 18, non sull'ultima): il salto a React 18 era già enorme rispetto a quello che RAWGraphs usava prima (React 16, vecchio di anni), e ha già richiesto trovare e sistemare diversi bug reali nell'app (drag-and-drop che si rompeva, un componente che si bloccava, problemi di layout). Andare oltre richiederebbe *anche* di aggiornare Bootstrap insieme, perché la libreria che collega Bootstrap a React (`react-bootstrap`), nella versione che usiamo, non è garantita funzionare con le versioni più recenti di React. Sono due aggiornamenti legati a doppio filo: non si può fare l'uno senza l'altro.
>
> **Bootstrap** (siamo sulla 4, non sulla 5): qui il motivo è più diretto — passare a Bootstrap 5 è un cambio "che rompe le cose", non un semplice aggiornamento. Bootstrap 5 non usa più jQuery (la 4 sì), molte classi CSS cambiano nome tra le due versioni, e va aggiornato insieme a `react-bootstrap` (che ha una versione compatibile solo con Bootstrap 5). Dato che i componenti Bootstrap sono usati in ogni schermata dell'app, il rischio di rompere l'aspetto visivo non è isolato a un punto, è ovunque.
>
> **Perché non farlo insieme al resto**: ogni fase di questo lavoro ha già fatto emergere bug reali che sarebbero passati inosservati con un semplice "aggiorna e spera che funzioni" — lo abbiamo visto anche solo con la legenda dei chart, un problema piccolo che ha richiesto ore. React 19 + Bootstrap 5 insieme toccherebbero *ogni* schermata dell'app contemporaneamente: è un progetto a sé, con test approfonditi, non qualcosa da infilare in mezzo ad altri aggiornamenti.

### Fasi precedenti (rawgraphs-core, rawgraphs-charts, rawgraphs-app)
Consolidamento npm/Yarn, aggiornamenti minori, Rollup 1/2→4, Babel, Jest 30, D3 v1/v2/v3→v7, React 18. Fatte in sessioni precedenti a questa, su branch `chore/deps-phase0`/`chore/deps-phase1` per ciascun repo. React 18 ha richiesto fix reali (crash react-dnd in StrictMode, hang del Web Worker per doppio-wrap di Comlink, bug di layout flexbox) oltre al semplice bump di versione.

**Yarn rimosso da rawgraphs-app** (commit `bffcf97`, core e charts usavano già npm da tempo). rawgraphs-app era l'unico repo rimasto su Yarn Classic (versione 1.22, in manutenzione — cioè senza più sviluppo attivo — dal 2020). Non serviva più a nulla se non a `yarn link`, l'unica cosa che npm non replicava altrettanto bene fino a poco tempo fa: ora `npm link` copre lo stesso caso d'uso, quindi tenere due package manager diversi nello stesso progetto non aveva più giustificazione.

Tenerlo era anche un rischio concreto, non solo ridondanza: il `node_modules` locale risultava già disallineato da `yarn.lock` (React 19 effettivamente installato contro una dichiarazione `^17.0.2` nel `package.json`) — sintomo di npm e yarn usati in modo intercambiabile sullo stesso progetto nel tempo, che silenziosamente installano cose diverse da quello che il lockfile promette. Sistemarlo ha fatto emergere problemi concreti: senza un lockfile pulito, un `npm install` da zero avrebbe preso `react-data-grid` 33 versioni più avanti (perdendo il CSS che l'app importa) e una versione di `sparqljs` con una sintassi che il build allora in uso non sapeva interpretare — entrambi pacchetti pre-1.0, dove i range di versione elastici (`^1.2.3`) non danno garanzie reali, quindi sono stati fissati a versioni esatte. Approfittando del sistemamento sono anche state aggiornate le CI (da Node 14, non più supportato dal 2023, a Node 22) e risolto un problema di configurazione OpenSSL/Node che faceva fallire la build su Node recenti.

---

## 2. Vulnerabilità `npm audit`

`npm audit` in rawgraphs-app segnalava 4 vulnerabilità high. Stato attuale:

| Pacchetto | Dove | Fixabile da app? | Stato |
|---|---|---|---|
| `js-cookie` (via `react-cookie-consent`) | dipendenza diretta di app | Sì | Applicato (`^9.0.0` → `^10.0.2`), **committato in locale, da pushare** |
| `d3-color` ReDoS | dentro `@rawgraphs/rawgraphs-core` e `@rawgraphs/rawgraphs-charts` (pubblicati su npm, versioni vecchie) | No, va risolto in core/charts | **Risolto, committato e pushato** in core/charts (vedi sotto) — resta da pubblicare su npm |

### rawgraphs-core — branch `chore/deps-phase1` (committato e pushato, commit `b11d590`)

`package.json`:
- aggiunto `overrides`: `d3-color: ^3.1.0`, `d3-selection: ^3.0.0`, `d3-transition: ^3.0.1` — forza queste versioni ovunque nell'albero, incluso dentro `d3-svg-legend` (che dichiara ancora `d3-selection@1.0.2`/`d3-transition@1.0.3` propri, pacchetto abbandonato dal 2022)
- aggiunta dipendenza diretta `d3: ^7.2.0` (prima assente, core usava solo i sotto-pacchetti singoli)

`src/legend.js`:
- la patch che dà a Selection il metodo `.transition()` ora importa `{ selection, transition }` da `"d3"` invece che separatamente da `"d3-selection"`/`"d3-transition"`

**Perché questo secondo cambio**: dopo aver applicato l'override sopra, la legenda dei chart si rompeva comunque (`cell.exit(...).transition is not a function`). Causa: Vite ottimizza il pacchetto meta `d3` (quello che `rawgraphs-charts` usa per creare le selection dei chart) e i sotto-pacchetti standalone `d3-selection`/`d3-transition` come due entry-point *separati* nel suo dependency pre-bundling — anche se puntano agli stessi file su disco, esbuild ne genera due copie bundlate distinte della classe `Selection`. Il fix precedente pat­chava la copia sbagliata. Importando da `"d3"` (lo stesso specificatore che usa charts) si garantisce che Vite risolva entrambi alla stessa copia condivisa. **Confermato funzionante dal curatore, sia in dev che nella build di produzione.**

### rawgraphs-charts — branch `chore/deps-phase1` (committato e pushato, commit `5cb9db1`)

`package.json`: aggiunto `overrides`: `d3-color: ^3.1.0` (charts porta la vulnerabilità anche tramite `d3-gridding`, che dipende da `d3@5.16.0` interno)

### rawgraphs-app — branch `chore/vite-migration` (in corso di commit dal curatore)

`package.json`: bump `react-cookie-consent` `^9.0.0` → `^10.0.2` (risolve `js-cookie`)

`vite.config.js`: aggiunto `server.fs.allow: ['..']` — necessario perché core/charts sono linkati da cartelle sorelle (fuori dalla root del progetto) e Vite di default non segue symlink verso pacchetti esterni annidati (charts→core) senza questo permesso esplicito. Utile finché si testa via link locale; da rivalutare se non serve più una volta che core/charts sono pubblicati su npm.

**Setup di test locale** (non fa parte del codice, solo ambiente locale): `node_modules/@rawgraphs/rawgraphs-core` e `rawgraphs-charts` in app sono symlink manuali verso le cartelle sorelle sul disco (non `npm link`, per problemi di affidabilità già riscontrati in passato quando si linkano più pacchetti condivisi insieme). `npm install` sovrascrive questi symlink ogni volta (non li conosce), quindi vanno ricreati dopo ogni install — vedi sequenza completa in fondo al documento.

---

## 3. Non risolto, rimandato al futuro

**`d3-gridding`** (usato da rawgraphs-charts): pacchetto di terzi abbandonato dal giugno 2022, hard-pinnato a `d3: "4 - 5"`. Nessuna versione più recente disponibile. L'override di `d3-color` lo neutralizza (forza comunque la versione sicura), ma resta una dipendenza morta nell'albero.

**`d3-svg-legend`** (usato da rawgraphs-core): stessa situazione di `d3-gridding` — abbandonato dal 2022, causa del bug della legenda appena risolto. Il codice usato da RAWGraphs è una piccola parte della libreria (solo `legendColor()`/`legendSize()`, con un sottoinsieme dell'API). Valutato: **avrebbe senso scrivere un'utility custom minimale** per sostituirlo — rimuoverebbe definitivamente questo genere di problemi (non solo l'audit di sicurezza, ma anche i futuri conflitti di versione D3 come quello di oggi). 26 tipi di chart lo usano, ma tutti attraverso questa unica funzione condivisa in core, quindi il testing è concentrato. Non iniziato — messo in coda.

**Bootstrap 4 → 5 / react-bootstrap 1.x → 2.x**: causa della maggioranza dei warning Sass e React rimasti. Migrazione breaking (niente jQuery, classi CSS diverse, Popper v1→v2). Rimandata, va pianificata come fase a sé.

---

## 4. Prossimi passi concreti

1. Push del commit del bump `react-cookie-consent` in rawgraphs-app
2. Decidere se/quando pubblicare su npm i fix di `chore/deps-phase1` in core e charts (finché non succede, gli utenti reali di questi pacchetti restano sulla versione vulnerabile — il fix esiste solo sul branch)
3. Eventuale riscrittura custom della legenda per eliminare `d3-svg-legend`
4. Decisione su Bootstrap 5 come fase futura separata

---

## 5. Come fare una build locale con tutti i fix (finché non è pubblicato su npm)

Core e charts sono collegati ad app via symlink manuali (non `npm link`, vedi sezione 2). Sequenza completa da zero:

```bash
# 1. core — nessun link, non consuma nulla in locale
cd rawgraphs-core
npm install
npm run build

# 2. charts — npm install sovrascrive il link interno verso core, va ricreato
cd ../rawgraphs-charts
npm install
rm -rf node_modules/@rawgraphs/rawgraphs-core
ln -s ../../../rawgraphs-core node_modules/@rawgraphs/rawgraphs-core
npm run build

# 3. app — npm install sovrascrive ENTRAMBI i link, vanno ricreati entrambi
cd ../rawgraphs-app
npm install
rm -rf node_modules/@rawgraphs/rawgraphs-core node_modules/@rawgraphs/rawgraphs-charts
ln -s ../../../rawgraphs-core node_modules/@rawgraphs/rawgraphs-core
ln -s ../../../rawgraphs-charts node_modules/@rawgraphs/rawgraphs-charts
npm run build
```

Se si usa `npm run dev` invece di `npm run build`: Vite tiene una cache delle dipendenze che non si accorge dei link rifatti, va cancellata a mano (`rm -rf node_modules/.vite`) o va avviato con `npm run dev -- --force`. Con `npm run build` non serve, ricostruisce tutto da zero ogni volta.
