# Boodschappenlijst met Cloudflare Pages en KV

## Uploaden naar GitHub

1. Pak deze zip uit.
2. Maak een nieuwe GitHub repository.
3. Klik in GitHub op Add file > Upload files.
4. Sleep alle bestanden en mappen uit deze map naar GitHub.
5. Klik op Commit changes.

## Cloudflare Pages

Maak een nieuw Pages project en koppel de GitHub repository.

Instellingen:

- Framework preset: None
- Build command: leeg laten
- Build output directory: .
- Root directory: leeg laten

## KV koppelen

Maak in Cloudflare een KV namespace aan, bijvoorbeeld boodschappen-kv.

Ga daarna naar je Pages project:

Settings > Bindings > Add binding > KV namespace

Gebruik:

- Variable name: BOODSCHAPPEN_KV
- KV namespace: jouw aangemaakte namespace

Deploy daarna opnieuw.

## Belangrijk

In wrangler.toml staan bewust geen KV ids. De KV binding regel je via het Cloudflare dashboard.
