const KV_KEY = 'boodschappen:v1';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function sortItems(items) {
  return [...items].sort((a, b) => {
    if (a.done !== b.done) return a.done ? -1 : 1;
    return a.name.localeCompare(b.name, 'nl', { sensitivity: 'base' });
  });
}

async function readItems(env) {
  const raw = await env.BOODSCHAPPEN_KV.get(KV_KEY, 'json');
  return Array.isArray(raw) ? raw : [];
}

async function saveItems(env, items) {
  await env.BOODSCHAPPEN_KV.put(KV_KEY, JSON.stringify(items));
  return sortItems(items);
}

async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function cleanName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, 80);
}

function makeId() {
  return crypto.randomUUID();
}

export async function onRequest(context) {
  const { request, env } = context;

  if (!env.BOODSCHAPPEN_KV) {
    return json({ error: 'KV binding BOODSCHAPPEN_KV ontbreekt.' }, 500);
  }

  if (request.method === 'GET') {
    const items = await readItems(env);
    return json({ items: sortItems(items) });
  }

  if (request.method === 'POST') {
    const body = await readBody(request);
    const name = cleanName(body.name);

    if (!name) {
      return json({ error: 'Vul een boodschap in.' }, 400);
    }

    const items = await readItems(env);
    items.push({ id: makeId(), name, done: false, createdAt: new Date().toISOString() });

    return json({ items: await saveItems(env, items) }, 201);
  }

  if (request.method === 'PATCH') {
    const body = await readBody(request);
    const id = String(body.id || '');

    if (!id) {
      return json({ error: 'Geen id meegegeven.' }, 400);
    }

    const items = await readItems(env);
    const item = items.find((entry) => entry.id === id);

    if (!item) {
      return json({ error: 'Boodschap niet gevonden.' }, 404);
    }

    item.done = Boolean(body.done);
    item.updatedAt = new Date().toISOString();

    return json({ items: await saveItems(env, items) });
  }

  if (request.method === 'DELETE') {
    const body = await readBody(request);
    const items = await readItems(env);

    let nextItems;

    if (body.doneOnly) {
      nextItems = items.filter((item) => !item.done);
    } else if (body.id) {
      nextItems = items.filter((item) => item.id !== String(body.id));
    } else {
      nextItems = [];
    }

    return json({ items: await saveItems(env, nextItems) });
  }

  return json({ error: 'Methode niet toegestaan.' }, 405);
}
