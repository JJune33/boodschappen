const KEY = 'boodschappen:v1';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}

function sortItems(items) {
  return items.sort((a, b) => {
    if (a.done !== b.done) return a.done ? -1 : 1;
    return a.name.localeCompare(b.name, 'nl', { sensitivity: 'base' });
  });
}

async function readItems(env) {
  const value = await env.BOODSCHAPPEN_KV.get(KEY, 'json');
  return Array.isArray(value) ? sortItems(value) : [];
}

async function writeItems(env, items) {
  const sorted = sortItems(items);
  await env.BOODSCHAPPEN_KV.put(KEY, JSON.stringify(sorted));
  return sorted;
}

async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export async function onRequest(context) {
  const { request, env } = context;

  if (!env.BOODSCHAPPEN_KV) {
    return json({ error: 'KV binding BOODSCHAPPEN_KV ontbreekt in Cloudflare Pages.' }, 500);
  }

  const method = request.method.toUpperCase();

  if (method === 'GET') {
    return json({ items: await readItems(env) });
  }

  if (method === 'POST') {
    const body = await readBody(request);
    const name = String(body.name || '').trim();

    if (!name) return json({ error: 'Vul een boodschap in.' }, 400);

    const items = await readItems(env);
    items.push({
      id: crypto.randomUUID(),
      name,
      done: false,
      createdAt: new Date().toISOString()
    });

    return json({ items: await writeItems(env, items) }, 201);
  }

  if (method === 'PATCH') {
    const body = await readBody(request);
    const id = String(body.id || '');
    const done = Boolean(body.done);

    if (!id) return json({ error: 'Geen id ontvangen.' }, 400);

    const items = await readItems(env);
    const item = items.find((entry) => entry.id === id);

    if (!item) return json({ error: 'Boodschap niet gevonden.' }, 404);

    item.done = done;
    item.updatedAt = new Date().toISOString();

    return json({ items: await writeItems(env, items) });
  }

  if (method === 'DELETE') {
    const body = await readBody(request);
    const items = await readItems(env);

    let nextItems;
    if (body.doneOnly) {
      nextItems = items.filter((item) => !item.done);
    } else if (body.id) {
      nextItems = items.filter((item) => item.id !== body.id);
    } else {
      nextItems = [];
    }

    return json({ items: await writeItems(env, nextItems) });
  }

  return json({ error: 'Methode niet toegestaan.' }, 405);
}
