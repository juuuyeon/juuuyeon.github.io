/* Local artwork navigation. No Figma session or external embed is needed. */
(async function () {
  const get = id => document.getElementById(id);
  let frames = [];
  const selectedId = () => decodeURIComponent(location.hash.slice(1));
  function selectFrame() {
    const index = Math.max(0, frames.findIndex(frame => frame.id === selectedId()));
    const frame = frames[index];
    if (!frame) return;
    get('position').textContent = `${index + 1} / ${frames.length}`;
    get('frame-title').textContent = frame.name;
    get('frame').alt = frame.name;
    get('frame').width = frame.width;
    get('frame').height = frame.height;
    get('frame').src = frame.src;
    get('artwork').style.setProperty('--native-width', `${frame.width}px`);
    get('artwork').scrollLeft = 0;
    get('image-link').href = frame.src;
    get('transcript').textContent = frame.text;
    document.querySelector('.transcript').hidden = !frame.text;
    document.querySelector('.transcript summary').textContent = frame.textMethod === 'ocr'
      ? '이미지에서 읽은 텍스트 · 오탈자가 있을 수 있습니다' : '화면 텍스트 읽기';
    for (const [key, target] of [['previous', index - 1], ['next', index + 1]]) {
      const available = target >= 0 && target < frames.length;
      get(key).setAttribute('aria-disabled', String(!available));
      get(key).tabIndex = available ? 0 : -1;
      if (available) get(key).href = `#${frames[target].id}`;
      else get(key).removeAttribute('href');
    }
    document.querySelectorAll('#index a').forEach(a => {
      if (a.hash === `#${frame.id}`) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }
  function renderIndex() {
    const query = get('search').value.toLowerCase().trim();
    const matches = frames.filter(frame => frame.name.toLowerCase().includes(query));
    get('index').replaceChildren(...matches.map(frame => {
      const a = document.createElement('a');
      a.href = `#${frame.id}`;
      a.textContent = `${String(frame.number).padStart(2, '0')} · ${frame.name}`;
      return a;
    }));
    get('empty').hidden = !!matches.length;
    selectFrame();
  }
  try {
    const response = await fetch(document.body.dataset.source);
    if (!response.ok) throw new Error('Unable to load frames');
    frames = (await response.json()).frames;
    get('total').textContent = `(${frames.length})`;
    get('search').addEventListener('input', renderIndex);
    get('frame').addEventListener('error', () => {
      get('status').textContent = '이미지를 불러오지 못했습니다. 새로고침하거나 PDF를 확인해 주세요.';
    });
    get('frame').addEventListener('load', () => { get('status').textContent = ''; });
    get('zoom').addEventListener('click', function () {
      const on = get('artwork').classList.toggle('expanded');
      this.setAttribute('aria-pressed', String(on));
      this.textContent = on ? '화면에 맞추기' : '확대하기';
    });
    get('top-link').addEventListener('click', event => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    window.addEventListener('hashchange', () => {
      selectFrame();
      get('frame-title').scrollIntoView({ block: 'start' });
    });
    if (matchMedia('(max-width:800px)').matches) document.querySelector('aside details').open = false;
    renderIndex();
  } catch (error) {
    get('status').textContent = '화면 목록을 불러오지 못했습니다. 새로고침하거나 PDF를 확인해 주세요.';
  }
}());
