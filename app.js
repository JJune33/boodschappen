const form = document.querySelector('#addForm');
const input = document.querySelector('#itemInput');
const list = document.querySelector('#list');
const statusEl = document.querySelector('#status');

function setStatus(message) {
  statusEl.textContent = message || '';
}

async function api(method, body) {
  const options = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch('/api/boodschappen', options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Er ging iets mis.');
  }

  return data;
}

function render(items) {
  list.innerHTML = '';

  if (!items.length) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'Nog geen boodschappen.';
    list.append(empty);
    return;
  }

  for (const item of items) {
    const li = document.createElement('li');
    li.className = `item ${item.done ? 'done' : ''}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.done;
    checkbox.setAttribute('aria-label', `${item.name} nodig aan of uit zetten`);
    checkbox.addEventListener('change', async () => {
      setStatus('Opslaan...');
      try {
        const data = await api('PATCH', { id: item.id, done: checkbox.checked });
        render(data.items);
        setStatus('Opgeslagen.');
      } catch (error) {
        checkbox.checked = item.done;
        setStatus(error.message);
      }
    });

    const name = document.createElement('span');
    name.className = 'name';
    name.textContent = item.name;

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'delete';
    remove.textContent = 'X';
    remove.addEventListener('click', async () => {
      setStatus('Verwijderen...');
      try {
        const data = await api('DELETE', { id: item.id });
        render(data.items);
        setStatus('Verwijderd.');
      } catch (error) {
        setStatus(error.message);
      }
    });

    li.append(checkbox, name, remove);
    list.append(li);
  }
}

async function loadItems() {
  setStatus('Laden...');
  try {
    const data = await api('GET');
    render(data.items);
    setStatus('');
  } catch (error) {
    setStatus(error.message);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = input.value.trim();
  if (!name) return;

  input.disabled = true;
  setStatus('Toevoegen...');

  try {
    const data = await api('POST', { name });
    input.value = '';
    render(data.items);
    setStatus('Toegevoegd.');
  } catch (error) {
    setStatus(error.message);
  } finally {
    input.disabled = false;
    input.focus();
  }
});
loadItems();
