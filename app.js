const API_URL = '/api/boodschappen';

const addForm = document.querySelector('#addForm');
const itemInput = document.querySelector('#itemInput');
const list = document.querySelector('#list');
const statusEl = document.querySelector('#status');
const template = document.querySelector('#itemTemplate');
const refreshButton = document.querySelector('#refreshButton');
const clearButton = document.querySelector('#clearButton');

function setStatus(message) {
  statusEl.textContent = message || '';
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Er ging iets mis.');
  }

  return data;
}

function renderItems(items) {
  list.replaceChildren();

  if (!items.length) {
    const empty = document.createElement('li');
    empty.className = 'status';
    empty.textContent = 'Nog geen boodschappen.';
    list.append(empty);
    return;
  }

  for (const item of items) {
    const node = template.content.firstElementChild.cloneNode(true);
    const checkbox = node.querySelector('.checkbox');
    const name = node.querySelector('.name');
    const deleteButton = node.querySelector('.delete');

    node.classList.toggle('checked', item.checked);
    checkbox.checked = item.checked;
    name.textContent = item.name;

    checkbox.addEventListener('change', async () => {
      setStatus('Opslaan...');
      try {
        await request(`${API_URL}/${encodeURIComponent(item.id)}`, {
          method: 'PATCH',
          body: JSON.stringify({ checked: checkbox.checked })
        });
        await loadItems();
      } catch (error) {
        checkbox.checked = item.checked;
        setStatus(error.message);
      }
    });

    deleteButton.addEventListener('click', async () => {
      setStatus('Verwijderen...');
      try {
        await request(`${API_URL}/${encodeURIComponent(item.id)}`, { method: 'DELETE' });
        await loadItems();
      } catch (error) {
        setStatus(error.message);
      }
    });

    list.append(node);
  }
}

async function loadItems() {
  setStatus('Laden...');
  try {
    const data = await request(API_URL);
    renderItems(data.items || []);
    setStatus('');
  } catch (error) {
    setStatus(error.message);
  }
}

addForm.addEventListener('submit', async event => {
  event.preventDefault();
  const name = itemInput.value.trim();

  if (!name) return;

  setStatus('Toevoegen...');
  try {
    await request(API_URL, {
      method: 'POST',
      body: JSON.stringify({ name })
    });
    itemInput.value = '';
    itemInput.focus();
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
});

refreshButton.addEventListener('click', loadItems);

clearButton.addEventListener('click', async () => {
  const confirmed = confirm('Weet je zeker dat je alles wilt wissen?');
  if (!confirmed) return;

  setStatus('Alles wissen...');
  try {
    await request(API_URL, { method: 'DELETE' });
    await loadItems();
  } catch (error) {
    setStatus(error.message);
  }
});

loadItems();
