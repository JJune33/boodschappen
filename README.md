# Boodschappenlijst met Cloudflare Pages en KV

## Wat zit erin

- Websitebestanden direct in de hoofdmap
- Een API bestand: `functions/api/boodschappen.js`
- Geen `public` map
- Geen `wrangler.toml`
- KV binding via het Cloudflare dashboard

## Uploaden naar GitHub

1. Pak deze zip uit.
2. Open de map waar `index.html` direct in staat.
3. Maak een nieuwe GitHub repository of open je bestaande repo.
4. Upload alle bestanden en de map `functions` naar GitHub.
5. Klik op `Commit changes`.

## Cloudflare Pages instellingen

- Framework preset: None
- Build command: leeg laten
- Build output directory: .
- Root directory: leeg laten

## KV koppelen

Maak in Cloudflare een KV namespace aan, bijvoorbeeld `boodschappen-kv`.

Ga daarna naar je Pages project:

`Settings > Bindings > Add > KV namespace`

Gebruik exact:

- Variable name: `BOODSCHAPPEN_KV`
- KV namespace: jouw aangemaakte namespace

Na het toevoegen van de binding moet je opnieuw deployen. De makkelijkste manier is een kleine wijziging committen in GitHub.

## Werking

- Nieuwe boodschappen krijgen meteen een vinkje aan.
- Aangevinkte boodschappen staan bovenaan.
- Binnen de aangevinkte en niet aangevinkte groep wordt alfabetisch gesorteerd.
- Aangevinkte boodschappen worden niet doorgestreept.
- Als je een vinkje uitzet, gaat die boodschap naar de onderste groep.
