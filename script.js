/* ============================================================
   grime95! — Ponder County booking records inquiry terminal
   Static. No build step. content.json is the only file to edit.
   Views: LEDGER (list + imaging panel), LINEUP (photo grid),
   RECORD (imaging + dot-matrix printout). Hash routes every
   record: #/rec/<id>. Read marks persist per device.
   ============================================================ */
(() => {
  'use strict';

  const LS_READ = 'grime95:read';
  const LS_LAST = 'grime95:last';

  const $ = (id) => document.getElementById(id);
  const els = {
    q: $('q'), sort: $('sortBy'), status: $('resultStatus'), total: $('totalCount'),
    tagline: $('tagline'), motd: $('motd'),
    viewList: $('viewList'), viewLineup: $('viewLineup'),
    ledgerView: $('ledgerView'), rows: $('rows'), empty: $('empty'), hint: $('emptyHint'), clear: $('clearBtn'),
    imaging: $('imaging'), imgBkg: $('imgBkg'), imgCanvas: $('imgCanvas'), imgFallback: $('imgFallback'), imgFields: $('imgFields'), imgCue: $('imgCue'),
    lineupView: $('lineupView'), lineupGrid: $('lineupGrid'),
    recordView: $('recordView'), recBkg: $('recBkg'), recCanvas: $('recCanvas'), recFields: $('recFields'), paper: $('paper'),
    sbarKeys: $('sbarKeys'), eof: $('eof'), latest: $('latestEntry')
  };

  let DATA = null;
  let ROWS = [];          // all characters, indexed
  let VISIBLE = [];       // current sorted+filtered rows
  let cursor = 0;         // index into VISIBLE
  let view = 'ledger';    // 'ledger' | 'lineup' | 'record'
  let openId = null;
  let returnFocus = null;

  /* ---------- storage ---------- */
  const store = {
    read() { try { return new Set(JSON.parse(localStorage.getItem(LS_READ) || '[]')); } catch { return new Set(); } },
    markRead(id) { try { const s = store.read(); s.add(id); localStorage.setItem(LS_READ, JSON.stringify([...s])); } catch { /* private mode */ } },
    last() { try { return localStorage.getItem(LS_LAST); } catch { return null; } },
    setLast(id) { try { localStorage.setItem(LS_LAST, id); } catch { /* noop */ } }
  };

  /* ---------- text ---------- */
  const norm = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const up = (s) => String(s ?? '').toUpperCase();
  const fmtDate = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ''); return m ? `${m[2]}-${m[3]}-${m[1]}` : (iso || ''); };

  function within(a, b, max) {
    if (a === b) return 0;
    if (Math.abs(a.length - b.length) > max) return max + 1;
    let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i]; let best = i;
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        if (cur[j] < best) best = cur[j];
      }
      if (best > max) return max + 1;
      prev = cur;
    }
    return prev[b.length];
  }

  /* ---------- index ---------- */
  function buildRows(data) {
    return data.characters.map((c) => {
      const charges = c.arrests.map(a => a.charge).join(' ');
      const locations = c.arrests.map(a => a.location).join(' ');
      const tags = [...new Set(c.arrests.flatMap(a => a.tags || []))];
      const officers = [...new Set(c.arrests.map(a => a.officer))];
      const haystack = norm([c.name, c.alias, charges, locations, tags.join(' '), officers.join(' ')].join(' '));
      return {
        c, tags, officers, haystack,
        words: haystack.split(' ').filter(Boolean),
        nameNorm: norm(c.name),
        priors: c.arrests.length,
        firstBooking: c.arrests[0].booking
      };
    });
  }

  function matches(row, terms) {
    for (const t of terms) {
      if (row.haystack.includes(t)) continue;
      const budget = t.length >= 7 ? 2 : t.length >= 4 ? 1 : 0;
      let hit = false;
      if (budget) for (const w of row.words) if (within(t, w, budget) <= budget) { hit = true; break; }
      if (!hit) return false;
    }
    return true;
  }

  function sorted(rows) {
    const by = els.sort.value;
    return [...rows].sort((a, b) => {
      if (by === 'first') return a.c.first.localeCompare(b.c.first) || a.c.last.localeCompare(b.c.last);
      if (by === 'booking') return a.firstBooking.localeCompare(b.firstBooking);
      if (by === 'priors') return b.priors - a.priors || a.c.last.localeCompare(b.c.last);
      return a.c.last.localeCompare(b.c.last) || a.c.first.localeCompare(b.c.first);
    });
  }

  /* highlight the matched term inside a field, uppercase */
  function hl(text, terms) {
    const u = up(text);
    if (!terms.length) return esc(u);
    const re = new RegExp('(' + terms.filter(t => t.length > 1).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
    if (!terms.some(t => t.length > 1)) return esc(u);
    return esc(u).replace(re, '<mark>$1</mark>');
  }

  /* when the match lives in a field the row doesn't print, name it */
  function hiddenHit(row, terms) {
    const shown = norm([row.c.name, row.c.alias, row.c.arrests.map(a => a.charge).join(' ')].join(' '));
    const shownWords = shown.split(' ');
    const unseen = terms.filter(t => !shown.includes(t) && !shownWords.some(w => within(t, w, t.length >= 7 ? 2 : t.length >= 4 ? 1 : 0) <= (t.length >= 7 ? 2 : t.length >= 4 ? 1 : 0)));
    if (!unseen.length) return null;
    const t = unseen[0];
    const test = (v) => { const n = norm(v); return n.includes(t) || n.split(' ').some(w => within(t, w, 2) <= 2); };
    const tag = row.tags.find(test);
    if (tag) return { label: 'TAG', value: tag };
    const a = row.c.arrests.find(x => test(x.location));
    if (a) return { label: 'PLACE', value: a.location };
    const o = row.officers.find(test);
    if (o) return { label: 'OFFICER', value: o };
    return null;
  }

  /* ---------- imaging: photos shown as-is; lineup uses assets/mugshots/thumb/, printout the full copy ---------- */
  const thumbOf = (src) => src.replace(/^(.*\/)([^\/]+)$/, '$1thumb/$2');

  function paint(target, src, fallbackImg) {
    target.dataset.src = src;
    const full = target.id === 'recCanvas';           // the printout gets the 900px copy
    const url = full ? src : thumbOf(src);
    if (target.tagName === 'IMG') { target.src = url; target.hidden = false; target.onerror = () => { target.src = src; }; return; }
    const ctx = target.getContext('2d');
    const im = new Image();
    im.onload = () => {
      if (target.dataset.src !== src) return;         // cursor moved on
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, target.width, target.height);
      const s = Math.min(target.width / im.naturalWidth, target.height / im.naturalHeight);
      const w = im.naturalWidth * s, h = im.naturalHeight * s;
      ctx.drawImage(im, (target.width - w) / 2, (target.height - h) / 2, w, h);
      if (fallbackImg) fallbackImg.hidden = true;
    };
    im.onerror = () => { if (url !== src) { im.src = src; } else if (fallbackImg) { fallbackImg.src = src; fallbackImg.hidden = false; } };
    im.src = url;
  }

  /* ---------- fields (shared by imaging panel and record) ---------- */
  function fieldsHTML(row, full) {
    const c = row.c, a = c.arrests[0];
    const terms = norm(els.q.value).split(' ').filter(Boolean);
    const out = [
      ['NAME', up(c.name)],
      ['AKA', c.alias ? `"${up(c.alias)}"` : '—'],
      ['BOOKED', fmtDate(a.date)],
      ['CHARGE', up(a.charge)],
      ['PLACE', up(a.location)],
      ['OFFICER', up(a.officer)],
      ['PRIORS', row.priors > 1 ? `${row.priors} BOOKINGS ON FILE` : 'NONE'],
      ['TAGS', row.tags.join(', ').toUpperCase()]
    ];
    return out.map(([k, v]) => `<dt>${k}</dt><dd class="${k === 'PRIORS' && row.priors > 1 ? 'is-alert' : ''}">${k === 'TAGS' && !full ? hl(v, terms) : hl(v, terms)}</dd>`).join('');
  }

  /* ---------- LEDGER ---------- */
  function renderLedger() {
    const terms = norm(els.q.value).split(' ').filter(Boolean);
    const readSet = store.read();
    const last = store.last();
    const filtered = terms.length ? ROWS.filter(r => matches(r, terms)) : ROWS;
    VISIBLE = sorted(filtered);
    if (cursor >= VISIBLE.length) cursor = Math.max(0, VISIBLE.length - 1);

    els.rows.innerHTML = VISIBLE.map((r, i) => {
      const c = r.c, a = c.arrests[0];
      const read = c.arrests.every(x => readSet.has(x.booking));
      const evidence = terms.length ? hiddenHit(r, terms) : null;
      return `<button type="button" class="row${i === cursor ? ' is-cursor' : ''}" data-id="${esc(c.id)}" data-i="${i}" data-read="${read ? 1 : 0}" aria-label="Open record ${esc(a.booking)}, ${esc(c.name)}">
        <span class="c-seen" aria-hidden="true">${read ? '\u2713' : (last === c.id ? '\u25BA' : '')}</span>
        <span class="c-bkg">${esc(a.booking)}</span>
        <span class="c-name">${hl(`${c.last}, ${c.first}`, terms)}</span>
        <span class="c-aka">${c.alias ? hl(`"${c.alias}"`, terms) : ''}</span>
        <span class="c-chg">${evidence ? `<span class="c-tag">${esc(evidence.label)}: ${hl(evidence.value, terms)} \u00b7 </span>` : ''}${hl(c.arrests.map(x => x.charge).join(' / '), terms)}</span>
        <span class="c-pri${r.priors > 1 ? ' is-multi' : ''}">${r.priors > 1 ? r.priors : ''}</span>
      </button>`;
    }).join('');

    const none = VISIBLE.length === 0;
    els.empty.hidden = !none;
    if (none && terms.length) {
      const t = terms[0]; let best = null, bestD = 99;
      for (const r of ROWS) for (const w of r.nameNorm.split(' ')) { const d = within(t, w, 3); if (d < bestD) { bestD = d; best = r.c.name; } }
      els.hint.textContent = best && bestD <= 3 ? `NEAREST NAME ON FILE: ${up(best)}` : '';
    } else els.hint.textContent = '';

    els.eof.textContent = VISIBLE.length ? `END OF FILE \u00b7 ${VISIBLE.length} RECORD${VISIBLE.length === 1 ? '' : 'S'}` : '';
    els.status.innerHTML = terms.length
      ? `<b>${VISIBLE.length}</b> OF ${ROWS.length} RECORDS MATCH "${esc(up(els.q.value.trim()))}"`
      : `<b>${ROWS.length}</b> RECORDS ON FILE &nbsp;&middot;&nbsp; SORTED BY ${esc(els.sort.selectedOptions[0].textContent)}`;

    paintImaging();
    if (view === 'lineup') renderLineup(readSet);
  }

  function paintImaging() {
    const r = VISIBLE[cursor];
    if (!r) {
      els.imgBkg.textContent = '';
      els.imgFields.innerHTML = '';
      els.imgCue.textContent = '';
      els.imgCanvas.getContext('2d').clearRect(0, 0, els.imgCanvas.width, els.imgCanvas.height);
      els.imgFallback.hidden = true;
      return;
    }
    els.imgBkg.textContent = r.c.arrests[0].booking;
    els.imgFields.innerHTML = fieldsHTML(r);
    els.imgCue.innerHTML = '<kbd>ENTER</kbd> OPEN RECORD';
    paint(els.imgCanvas, r.c.arrests[0].mugshot, els.imgFallback);
  }

  function setCursor(i, { scroll = true } = {}) {
    if (!VISIBLE.length) return;
    cursor = Math.max(0, Math.min(VISIBLE.length - 1, i));
    const rows = els.rows.children;
    for (let k = 0; k < rows.length; k++) rows[k].classList.toggle('is-cursor', k === cursor);
    if (view === 'lineup') {
      let hit = null;
      for (const m of els.lineupGrid.children) { const on = +m.dataset.i === cursor; m.classList.toggle('is-cursor', on); if (on) hit = m; }
      if (scroll) {
        if (hit) hit.scrollIntoView({ block: 'nearest' });
        else scrollTo({ top: els.lineupGrid.getBoundingClientRect().top + scrollY + Math.floor(cursor / LU.cols) * LU.rowH - innerHeight / 3 });
      }
    } else if (scroll && rows[cursor]) rows[cursor].scrollIntoView({ block: 'nearest' });
    paintImaging();
  }

  /* ---------- LINEUP ---------- */
function mugHTML(r, i, readSet) {
    const c = r.c, a = c.arrests[0];
    const read = c.arrests.every(x => readSet.has(x.booking));
    return `<button type="button" class="mug${i === cursor ? ' is-cursor' : ''}" data-id="${esc(c.id)}" data-i="${i}" data-read="${read ? 1 : 0}" aria-label="Open record ${esc(a.booking)}, ${esc(c.name)}">
        <span class="mug__frame"><img alt="" data-lazy="${esc(a.mugshot)}" decoding="async" hidden></span>
        <span class="mug__bkg">${esc(a.booking)}${read ? ' \u2713' : ''}</span>
        <span class="mug__name">${esc(up(c.name))}</span>
        <span class="mug__aka">${c.alias ? esc(up(`"${c.alias}"`)) : '\u00a0'}</span>
        ${r.priors > 1 ? `<span class="mug__pri">${r.priors} BOOKINGS</span>` : ''}
      </button>`;
  }

  // The lineup is windowed: only rows near the viewport are in the DOM, the rest is spacer.
  // Mounting all 300+ mugs made a 17,000px document Chromium kept rasterized (~450 MB with
  // no images, ~900 MB with them). Windowed it sits near the 10-record baseline.
  let lineupIO = null;
  const LU = { cols: 1, rowH: 300, start: -1, end: -1, readSet: null };
  function lineupMetrics() {
    const grid = els.lineupGrid, probe = grid.querySelector('.mug');
    if (!probe) return;
    const cs = getComputedStyle(grid);
    LU.cols = Math.max(1, cs.gridTemplateColumns.split(' ').filter(Boolean).length);
    LU.rowH = probe.getBoundingClientRect().height + (parseFloat(cs.rowGap) || 0);
  }
  function renderLineup(readSet = store.read()) {
    LU.readSet = readSet; LU.start = LU.end = -1;
    const grid = els.lineupGrid;
    grid.style.paddingTop = ''; grid.style.height = '';
    grid.innerHTML = VISIBLE.slice(0, Math.min(6, VISIBLE.length)).map((r, i) => mugHTML(r, i, readSet)).join('');
    lineupMetrics();
    lineupWindow(true);
  }
  function lineupWindow(force) {
    const grid = els.lineupGrid;
    if (!VISIBLE.length) { grid.innerHTML = ''; grid.style.height = ''; grid.style.paddingTop = ''; return; }
    const rows = Math.ceil(VISIBLE.length / LU.cols);
    grid.style.boxSizing = 'border-box';
    grid.style.height = (rows * LU.rowH) + 'px';
    grid.style.alignContent = 'start';
    const top = grid.getBoundingClientRect().top;
    const firstRow = Math.max(0, Math.floor(-top / LU.rowH) - 2);
    const lastRow = Math.min(rows, Math.ceil((-top + innerHeight) / LU.rowH) + 2);
    const start = firstRow * LU.cols, end = Math.min(VISIBLE.length, lastRow * LU.cols);
    if (!force && start === LU.start && end === LU.end) return;
    LU.start = start; LU.end = end;
    grid.style.paddingTop = (firstRow * LU.rowH) + 'px';
    grid.innerHTML = VISIBLE.slice(start, end).map((r, k) => mugHTML(r, start + k, LU.readSet)).join('');
    if (lineupIO) lineupIO.disconnect();
    lineupIO = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const im = e.target.querySelector('img[data-lazy]');   // observe the frame: a hidden <img> has no box
        if (e.isIntersecting && im && !im.dataset.painted) { im.dataset.painted = '1'; lineupIO.unobserve(e.target); paint(im, im.dataset.lazy, null); }
      }
    }, { rootMargin: '200px' });
    grid.querySelectorAll('.mug__frame').forEach((f) => lineupIO.observe(f));
  }
  let luTick = 0;
  addEventListener('scroll', () => { if (view !== 'lineup' || luTick) return; luTick = requestAnimationFrame(() => { luTick = 0; lineupWindow(false); }); }, { passive: true });
  addEventListener('resize', () => { if (view !== 'lineup') return; lineupMetrics(); lineupWindow(true); });

  /* ---------- RECORD (the printout) ---------- */
  function paperHTML(row) {
    const c = row.c;
    const multi = c.arrests.length > 1;
    const head = `
      <p class="paper__hd">Ponder County Sheriff's Dept. &mdash; Incident Report
        <small>Records inquiry &middot; Terminal 03<i><span class="sep"> &middot; </span>${multi ? `${c.arrests.length} bookings on file` : `Booking ${esc(c.arrests[0].booking)}`}</i></small>
      </p>
      <dl class="paper__grid">
        <dt>Subject</dt><dd id="recName">${esc(up(c.name))}</dd>
        <dt>AKA</dt><dd>${c.alias ? `<span class="aka">&ldquo;${esc(c.alias)}&rdquo;</span>` : '&mdash;'}</dd>
        ${multi ? '' : `
        <dt>Charge</dt><dd>${esc(c.arrests[0].charge)}</dd>
        <dt>Location</dt><dd>${esc(c.arrests[0].location)}</dd>
        <dt>Officer</dt><dd>${esc(c.arrests[0].officer)}</dd>
        <dt>Date</dt><dd>${esc(fmtDate(c.arrests[0].date))}</dd>`}
      </dl>`;

    const arrests = c.arrests.map((a, i) => `
      <section class="arrest">
        ${multi ? `
        <h2>Booking ${esc(a.booking)} &middot; ${esc(fmtDate(a.date))} &middot; arrest ${i + 1} of ${c.arrests.length}</h2>
        <dl class="paper__grid">
          <dt>Charge</dt><dd>${esc(a.charge)}</dd>
          <dt>Location</dt><dd>${esc(a.location)}</dd>
          <dt>Officer</dt><dd>${esc(a.officer)}</dd>
        </dl>` : ''}
        <h3>Narrative</h3>
        <div class="narr">${a.story.map(p => `<p>${esc(p)}</p>`).join('')}</div>
      </section>`).join('');

    const related = ROWS.filter(r => r.c.id !== c.id && r.tags.some(t => row.tags.includes(t))).slice(0, 8);
    const xref = related.length ? `
      <div class="xref">
        <h3>See also</h3>
        <ul>${related.map(r => {
          const shared = r.tags.filter(t => row.tags.includes(t));
          return `<li><button type="button" data-goto="${esc(r.c.id)}">${esc(r.c.arrests[0].booking)} ${esc(r.c.name)}</button> <span>&mdash; ${esc(shared.join(', '))}</span></li>`;
        }).join('')}</ul>
      </div>` : '';

    return head + arrests + xref + `<p class="paper__end">End of report</p>`;
  }

  function resolveId(key) {
    if (ROWS.some(r => r.c.id === key)) return key;
    const byBooking = ROWS.find(r => r.c.arrests.some(a => a.booking === key));
    return byBooking ? byBooking.c.id : null;
  }

  function openRecord(key, { push = true } = {}) {
    const id = resolveId(key);
    const idx = id ? ROWS.findIndex(r => r.c.id === id) : -1;
    if (idx < 0) return;
    const row = ROWS[idx];
    if (view !== 'record') returnFocus = document.activeElement;
    openId = id;
    // cursor follows the opened record when it's visible
    const vi = VISIBLE.findIndex(r => r.c.id === id);
    if (vi >= 0) cursor = vi;

    els.recBkg.textContent = row.c.arrests[0].booking;
    els.recFields.innerHTML = fieldsHTML(row, true);
    paint(els.recCanvas, row.c.arrests[0].mugshot, null);
    els.paper.className = 'paper' + (row.c.arrests.length > 1 ? ' paper--multi' : '');
    els.paper.innerHTML = paperHTML(row);
    // restart the feed
    els.paper.style.animation = 'none'; void els.paper.offsetWidth; els.paper.style.animation = '';

    showView('record');
    if (push) location.hash = `/rec/${encodeURIComponent(row.c.arrests[0].booking)}`;
    row.c.arrests.forEach(a => store.markRead(a.booking));
    store.setLast(id);
    els.recordView.querySelector('[data-back]').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function closeRecord({ push = true } = {}) {
    openId = null;
    showView(localStorage.getItem('grime95:view') === 'lineup' ? 'lineup' : 'ledger');
    if (push && location.hash) history.pushState(null, '', location.pathname + location.search);
    renderLedger();
    const target = els.rows.children[cursor] || els.q;
    if (target) target.focus({ preventScroll: true });
    if (els.rows.children[cursor]) els.rows.children[cursor].scrollIntoView({ block: 'center' });
  }

  function step(dir) {
    if (!VISIBLE.length) return;
    const i = VISIBLE.findIndex(r => r.c.id === openId);
    const n = (i < 0 ? 0 : i + dir + VISIBLE.length) % VISIBLE.length;
    openRecord(VISIBLE[n].c.id);
  }

  /* ---------- views ---------- */
  function showView(v) {
    view = v;
    els.ledgerView.hidden = v !== 'ledger';
    els.lineupView.hidden = v !== 'lineup';
    els.recordView.hidden = v !== 'record';
    els.viewList.setAttribute('aria-pressed', String(v === 'ledger'));
    els.viewLineup.setAttribute('aria-pressed', String(v === 'lineup'));
    els.sbarKeys.innerHTML = v === 'record'
      ? '<kbd>ESC</kbd> LEDGER &nbsp;<kbd>&larr;&rarr;</kbd> PREV/NEXT &nbsp;<kbd>/</kbd> FIND'
      : '<kbd>&uarr;&darr;</kbd> MOVE &nbsp;<kbd>ENTER</kbd> OPEN &nbsp;<kbd>/</kbd> FIND &nbsp;<kbd>F1</kbd> LEDGER &nbsp;<kbd>F2</kbd> LINEUP';
    if (v === 'lineup') renderLineup();
    if (v !== 'record') { try { localStorage.setItem('grime95:view', v); } catch { /* noop */ } }
  }

  /* ---------- routing ---------- */
  function route() {
    const m = /^#\/rec\/(.+)$/.exec(location.hash);
    if (m) {
      const key = decodeURIComponent(m[1]);
      if (resolveId(key)) openRecord(key, { push: false });
      else if (ROWS.length) { closeRecord({ push: false }); els.status.innerHTML = `NO RECORD <b>${esc(up(key))}</b> ON FILE`; }
    }
    else if (view === 'record') closeRecord({ push: false });
  }

  /* ---------- events ---------- */
  let tid = null;
  els.q.addEventListener('input', () => { clearTimeout(tid); tid = setTimeout(() => { cursor = 0; renderLedger(); }, 80); });
  els.sort.addEventListener('change', () => { cursor = 0; renderLedger(); });
  els.clear.addEventListener('click', () => { els.q.value = ''; cursor = 0; renderLedger(); els.q.focus(); });
  els.viewList.addEventListener('click', () => showView('ledger'));
  els.viewLineup.addEventListener('click', () => showView('lineup'));

  const onPick = (e) => {
    const b = e.target.closest('[data-id]');
    if (b) openRecord(b.dataset.id);
  };
  els.rows.addEventListener('click', onPick);
  els.lineupGrid.addEventListener('click', onPick);
  const onHover = (e) => {
    const b = e.target.closest('[data-i]');
    if (b && view !== 'record') setCursor(+b.dataset.i, { scroll: false });
  };
  els.rows.addEventListener('mouseover', onHover);
  els.rows.addEventListener('focusin', onHover);
  els.lineupGrid.addEventListener('focusin', onHover);

  els.recordView.addEventListener('click', (e) => {
    if (e.target.closest('[data-back]')) { closeRecord(); return; }
    if (e.target.closest('[data-prev]')) { step(-1); return; }
    if (e.target.closest('[data-next]')) { step(1); return; }
    const go = e.target.closest('[data-goto]');
    if (go) openRecord(go.dataset.goto);
  });

  document.addEventListener('keydown', (e) => {
    const inField = e.target === els.q || e.target === els.sort;
    if (e.key === 'F1') { e.preventDefault(); if (view === 'record') closeRecord(); showView('ledger'); return; }
    if (e.key === 'F2') { e.preventDefault(); if (view === 'record') closeRecord(); showView('lineup'); return; }
    if (e.key === '/' && !inField) { e.preventDefault(); if (view === 'record') closeRecord(); els.q.focus(); els.q.select(); return; }
    if (view === 'record') {
      if (e.key === 'Escape') { e.preventDefault(); closeRecord(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      return;
    }
    if (e.key === 'Escape') {
      if (els.q.value) { els.q.value = ''; cursor = 0; renderLedger(); }
      return;
    }
    if (e.target === els.sort) return;
    const cols = view === 'lineup' ? Math.max(1, Math.round(els.lineupGrid.clientWidth / (els.lineupGrid.firstElementChild?.offsetWidth || 1))) : 1;
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(cursor + cols); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor(cursor - cols); }
    else if (e.key === 'ArrowRight' && view === 'lineup') { e.preventDefault(); setCursor(cursor + 1); }
    else if (e.key === 'ArrowLeft' && view === 'lineup') { e.preventDefault(); setCursor(cursor - 1); }
    else if (e.key === 'PageDown') { e.preventDefault(); setCursor(cursor + 10); }
    else if (e.key === 'PageUp') { e.preventDefault(); setCursor(cursor - 10); }
    else if (e.key === 'Home' && !inField) { e.preventDefault(); setCursor(0); }
    else if (e.key === 'End' && !inField) { e.preventDefault(); setCursor(VISIBLE.length - 1); }
    else if (e.key === 'Enter' && (inField || e.target.tagName !== 'BUTTON')) { e.preventDefault(); if (VISIBLE[cursor]) openRecord(VISIBLE[cursor].c.id); }
  });

  window.addEventListener('hashchange', route);

  /* ---------- boot ---------- */
  fetch('content.json')
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(data => {
      DATA = data;
      ROWS = buildRows(data);
      els.total.textContent = ROWS.length;
      const latest = ROWS.reduce((m, r) => { const b = r.c.arrests[r.c.arrests.length - 1].booking; return !m || b > m.b ? { b, r } : m; }, null);
      if (latest) els.latest.textContent = `${latest.b} ${up(latest.r.c.last)}`;
      if (data.tagline) els.tagline.textContent = up(data.tagline);
      els.motd.textContent = data.closing || '';
      let v = 'ledger';
      try { v = localStorage.getItem('grime95:view') === 'lineup' ? 'lineup' : 'ledger'; } catch { /* noop */ }
      renderLedger();
      showView(v);
      route();
    })
    .catch(() => {
      els.empty.hidden = false;
      els.empty.querySelector('b').textContent = 'RECORDS DATABASE OFFLINE.';
      els.hint.textContent = 'CONTENT.JSON COULD NOT BE READ. SERVE THIS FOLDER OVER HTTP.';
      els.status.textContent = 'ERROR';
    });
})();
