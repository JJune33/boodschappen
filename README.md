# Boodschappenlijst met Cloudflare Pages Functions en KV

Eenvoudige boodschappen web app met opslag in Cloudflare KV.

## Bestanden

```text
index.html
style.css
app.js
404.html
_headers
_redirects
functions/_lib/storage.js
functions/api/boodschappen/index.js
functions/api/boodschappen/[id].js
wrangler.toml
package.json
.gitignore
```

## Functionaliteit

- Boodschap toevoegen
- Boodschappen tonen
- Vinkje aan en uit zetten
- Boodschap verwijderen
- Alles wissen
- Opslag in Cloudflare KV
- Sortering: eerst aangevinkt, daarna alfabetisch
- Bij aanpassen van een vinkje wordt de lijst opnieuw geladen

## Naar GitHub uploaden

1. Maak een nieuwe repository aan op GitHub.
2. Upload alle bestanden uit deze map naar de hoofdmap van je repository.
3. Commit de bestanden.

## Cloudflare Pages koppelen

1. Ga naar Cloudflare Dashboard.
2. Ga naar Workers & Pages.
3. Kies Create application.
4. Kies Pages.
5. Koppel je GitHub repository.
6. Gebruik deze instellingen:

```text
Framework preset: None
Build command: leeg laten
Build output directory: .
Root directory: leeg laten
```

## KV namespace maken

1. Ga in Cloudflare naar Storage & Databases.
2. Kies KV.
3. Maak een namespace aan, bijvoorbeeld:

```text
boodschappen-kv
```

## KV binding toevoegen aan Pages

1. Open je Pages project.
2. Ga naar Settings.
3. Ga naar Bindings.
4. Voeg een KV namespace binding toe.
5. Gebruik exact deze variable name:

```text
BOODSCHAPPEN_KV
```

6. Kies je KV namespace, bijvoorbeeld `boodschappen-kv`.
7. Sla op.
8. Start een nieuwe deploy.

## Lokaal testen

Installeer eerst dependencies:

```bash
npm install
```

Start lokaal:

```bash
npm run dev
```

## API routes

```text
GET    /api/boodschappen
POST   /api/boodschappen
PATCH  /api/boodschappen/:id
DELETE /api/boodschappen/:id
DELETE /api/boodschappen
```

## Let op

De app werkt pas online als de KV binding `BOODSCHAPPEN_KV` in Cloudflare Pages is toegevoegd.
