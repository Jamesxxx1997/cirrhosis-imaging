/* ===================================================================
   App shell: hash routing, rendering, calculators, lightbox.
   =================================================================== */

const root = document.getElementById('app');
const presence = {}; // "liver_surface:us" -> "yes" | "no"
let selectedFindingId = FINDINGS[0].id;

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function li(points) {
  if (!points || !points.length) return '';
  return points.map((p) => `<li>${esc(p)}</li>`).join('');
}
function imgStrip(images) {
  if (!images || !images.length) return '';
  return `<div class="img-strip">${images
    .map((img) => `<figure><img src="${img.src}" alt="${esc(img.caption || '')}" onclick="openLightbox('${img.src}')"><figcaption>${esc(img.caption || '')}</figcaption></figure>`)
    .join('')}</div>`;
}

/* ---------------- routing ---------------- */
function parseHash() {
  const h = (location.hash || '#diagnosis/imaging').replace('#', '');
  const [top, sub] = h.split('/');
  return { top: top || 'diagnosis', sub: sub || (top === 'diagnosis' ? 'imaging' : '') };
}

function navigate() {
  const { top, sub } = parseHash();
  renderTopNav(top);
  if (top === 'diagnosis') {
    renderSubNav(sub);
    if (sub === 'history') renderHistory();
    else renderImaging();
  } else {
    document.getElementById('subnav').innerHTML = '';
    if (top === 'treatment') renderTreatment();
    else if (top === 'prognosis') renderPrognosis();
  }
}

function renderTopNav(active) {
  const tabs = [
    { id: 'diagnosis', label: '診斷' },
    { id: 'treatment', label: '治療' },
    { id: 'prognosis', label: '預後' },
  ];
  document.getElementById('topnav').innerHTML = tabs
    .map((t) => `<button class="${t.id === active ? 'active' : ''}" data-go="${t.id}/${t.id === 'diagnosis' ? 'imaging' : ''}">${t.label}</button>`)
    .join('');
  document.getElementById('topnav').querySelectorAll('button').forEach((b) => {
    b.onclick = () => { location.hash = '#' + b.dataset.go; };
  });
}

function renderSubNav(active) {
  const subs = [
    { id: 'history', label: '病史 / 抽血' },
    { id: 'imaging', label: '影像' },
  ];
  document.getElementById('subnav').innerHTML = subs
    .map((s) => `<button class="${s.id === active ? 'active' : ''}" data-go="diagnosis/${s.id}">${s.label}</button>`)
    .join('');
  document.getElementById('subnav').querySelectorAll('button').forEach((b) => {
    b.onclick = () => { location.hash = '#' + b.dataset.go; };
  });
}

/* ---------------- Imaging page ---------------- */
function renderImaging() {
  const usFindings = FINDINGS.filter((f) => f.us);
  const ctFindings = FINDINGS.filter((f) => f.ct);

  root.innerHTML = `
    <div class="page-title">影像表現 Imaging Findings</div>
    <p class="page-sub">左側可標記每個 sign 在 US / CT 上「有 / 無」,並點選 sign 名稱在右側查看完整圖文說明。</p>

    <div class="diff-card">
      <h2>${esc(CARDIAC_VS_LIVER.title)}</h2>
      <p class="intro">${esc(CARDIAC_VS_LIVER.intro)}</p>
      <table class="diff-table">
        <thead><tr><th>Feature</th><th>肝硬化 Cirrhosis</th><th>鬱血性肝病 Congestive Hepatopathy</th></tr></thead>
        <tbody>
          ${CARDIAC_VS_LIVER.rows.map((r) => `<tr><td class="feature">${esc(r.feature)}</td><td>${esc(r.cirrhosis)}</td><td>${esc(r.congestive)}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>

    <div class="summary-box" id="summary-box"></div>

    <div class="explorer-wrap">
      <div class="explorer-list">
        <div class="list-col">
          <h3>Ultrasound</h3>
          ${usFindings.map((f) => signRowHtml(f, 'us')).join('')}
        </div>
        <div class="list-col">
          <h3>CT</h3>
          ${ctFindings.map((f) => signRowHtml(f, 'ct')).join('')}
        </div>
      </div>
      <div class="explorer-detail" id="explorer-detail"></div>
    </div>
  `;

  root.querySelectorAll('.yn input[type="radio"]').forEach((r) => {
    r.onchange = () => {
      presence[`${r.dataset.id}:${r.dataset.mod}`] = r.value;
      renderSummary();
    };
  });
  root.querySelectorAll('.sign-name').forEach((el) => {
    el.onclick = () => { selectedFindingId = el.dataset.id; renderImaging(); };
  });

  renderSummary();
  renderDetail();
}

function signRowHtml(f, mod) {
  const key = `${f.id}:${mod}`;
  const val = presence[key];
  const active = selectedFindingId === f.id ? 'active' : '';
  return `<div class="sign-row ${active}">
    <label class="yn"><input type="radio" name="${key}" value="yes" data-id="${f.id}" data-mod="${mod}" ${val === 'yes' ? 'checked' : ''}> 有</label>
    <label class="yn no"><input type="radio" name="${key}" value="no" data-id="${f.id}" data-mod="${mod}" ${val === 'no' ? 'checked' : ''}> 無</label>
    <span class="sign-name" data-id="${f.id}">${esc(f.name)}</span>
  </div>`;
}

function renderSummary() {
  const el = document.getElementById('summary-box');
  if (!el) return;
  const positives = [];
  FINDINGS.forEach((f) => {
    if (presence[`${f.id}:us`] === 'yes') positives.push(`${f.name} (US)`);
    if (presence[`${f.id}:ct`] === 'yes') positives.push(`${f.name} (CT)`);
  });
  el.innerHTML = `
    <h3>已標記為「有」的徵象</h3>
    ${positives.length
      ? `<div class="summary-chips">${positives.map((p) => `<span class="summary-chip">${esc(p)}</span>`).join('')}</div>`
      : '<div class="summary-empty">尚未標記任何徵象為「有」</div>'}
  `;
}

function renderDetail() {
  const el = document.getElementById('explorer-detail');
  if (!el) return;
  const f = FINDINGS.find((x) => x.id === selectedFindingId);
  if (!f) { el.innerHTML = '<div class="empty-hint">點選左側 sign 名稱以查看圖文說明</div>'; return; }
  const dual = f.us && f.ct;
  el.innerHTML = `
    <h2>${esc(f.name)}</h2>
    <p class="name-en">${esc(f.nameEn)}</p>
    <div class="modality-grid ${dual ? 'dual' : ''}">
      ${renderModalityPanel('Ultrasound', f.us)}
      ${renderModalityPanel('CT', f.ct)}
    </div>
  `;
}

function renderModalityPanel(label, data) {
  if (!data) return '';
  let body = '';
  if (data.normal || data.abnormal) {
    if (data.normal) {
      body += `<div class="subhead">正常 Normal</div><ul>${li(data.normal.points)}</ul>${imgStrip(data.normal.images)}`;
    }
    if (data.abnormal) {
      body += `<div class="subhead">異常 Abnormal</div><ul>${li(data.abnormal.points)}</ul>${imgStrip(data.abnormal.images)}`;
    }
  } else {
    body += `<ul>${li(data.points)}</ul>${imgStrip(data.images)}`;
  }
  if (data.quantitative) {
    const q = data.quantitative;
    body += `<div class="subhead">${esc(q.title)}</div><ul>${li(q.points)}</ul>${imgStrip([q.image])}`;
  }
  return `<div class="modality-panel"><h3>${label}</h3>${body}</div>`;
}

function openLightbox(src) {
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `<img src="${src}">`;
  lb.onclick = () => document.body.removeChild(lb);
  document.body.appendChild(lb);
}

/* ---------------- History / Labs page ---------------- */
function renderHistory() {
  root.innerHTML = `
    <div class="page-title">病史 / 非侵入性纖維化評估</div>
    <p class="page-sub">血清標記計算器,適合初步篩檢與追蹤。FibroTest 演算法未公開,僅提供參考說明。</p>
    <div class="calc-grid" id="labs-calc-grid"></div>
  `;
  const grid = document.getElementById('labs-calc-grid');
  grid.appendChild(buildCalcCard('fib4', CALCULATORS.fib4, computeFib4));
  grid.appendChild(buildCalcCard('apri', CALCULATORS.apri, computeApri));
  grid.appendChild(buildRefCard(CALCULATORS.fibrotest));
}

function buildCalcCard(key, calc, computeFn) {
  const card = document.createElement('div');
  card.className = 'calc-card';
  card.innerHTML = `
    <h3>${esc(calc.name)}</h3>
    <p class="summary">${esc(calc.summary)}</p>
    <div class="formula">${esc(calc.formula)}</div>
    ${calc.inputs.map((inp) => `
      <label for="${key}-${inp.id}">${esc(inp.label)}${inp.unit ? ` (${esc(inp.unit)})` : ''}</label>
      <input type="number" step="any" id="${key}-${inp.id}" ${inp.default ? `value="${inp.default}"` : ''} placeholder="${inp.default || ''}">
    `).join('')}
    <button class="compute-btn">計算</button>
    <div class="calc-result"></div>
    <ul class="cutoff-list">
      ${calc.cutoffs.map((c) => `<li><b>${esc(c.range)}</b> — ${esc(c.label)}${c.detail ? ` <i>(${esc(c.detail)})</i>` : ''}</li>`).join('')}
    </ul>
  `;
  card.querySelector('.compute-btn').onclick = () => {
    const vals = {};
    calc.inputs.forEach((inp) => { vals[inp.id] = parseFloat(document.getElementById(`${key}-${inp.id}`).value); });
    const out = computeFn(vals);
    const resultEl = card.querySelector('.calc-result');
    if (out === null) {
      resultEl.innerHTML = '請輸入所有數值';
    } else {
      resultEl.innerHTML = `${calc.name} = ${out.value.toFixed(2)}<span class="verdict">${esc(out.verdict)}</span>`;
    }
    resultEl.classList.add('show');
  };
  return card;
}

function buildRefCard(calc) {
  const card = document.createElement('div');
  card.className = 'calc-card';
  card.innerHTML = `
    <h3>${esc(calc.name)}</h3>
    <p class="summary">${esc(calc.summary)}</p>
    <div class="formula">${esc(calc.formula)}</div>
    <ul class="cutoff-list">
      ${calc.cutoffs.map((c) => `<li><b>${esc(c.range)}</b> — ${esc(c.label)}</li>`).join('')}
    </ul>
  `;
  return card;
}

function computeFib4(v) {
  if ([v.age, v.ast, v.alt, v.plt].some((x) => isNaN(x) || x <= 0)) return null;
  const value = (v.age * v.ast) / (v.plt * Math.sqrt(v.alt));
  let verdict;
  if (value <= 1.30) verdict = '低風險(Rule out),NPV 90%';
  else if (value >= 2.67) verdict = '高風險(Rule in),PPV 80%';
  else verdict = '中間區間,無法排除也無法確診';
  return { value, verdict };
}

function computeApri(v) {
  if ([v.ast, v.astUln, v.plt].some((x) => isNaN(x) || x <= 0)) return null;
  const value = ((v.ast / v.astUln) * 100) / v.plt;
  let verdict;
  if (value >= 1.0) verdict = '≥1.0:支持肝硬化(F4),敏感度 76% / 特異度 72%';
  else if (value >= 0.7) verdict = '≥0.7:支持顯著纖維化(F2-F4),敏感度 77% / 特異度 72%';
  else verdict = '低於纖維化篩檢切點';
  return { value, verdict };
}

/* ---------------- Treatment page ---------------- */
function renderTreatment() {
  root.innerHTML = `
    <div class="page-title">治療 Treatment</div>
    <p class="page-sub">依併發症分區,內容力求簡潔可查詢。</p>
    ${TREATMENT.map((t) => `
      <div class="section-card">
        <h3>${esc(t.title)}</h3>
        <ul>${li(t.points)}</ul>
      </div>
    `).join('')}
  `;
}

/* ---------------- Prognosis page ---------------- */
function renderPrognosis() {
  root.innerHTML = `
    <div class="page-title">預後 Prognosis</div>

    <div class="section-card">
      <h3>${esc(PROGNOSIS.compensated.title)}</h3>
      <ul>${li(PROGNOSIS.compensated.points)}</ul>
    </div>
    <div class="section-card">
      <h3>${esc(PROGNOSIS.decompensated.title)}</h3>
      <ul>${li(PROGNOSIS.decompensated.points)}</ul>
    </div>
    ${PROGNOSIS.guidelines.map((g) => `
      <div class="section-card">
        <h3>${esc(g.name)}</h3>
        <ul>${li(g.points)}</ul>
      </div>
    `).join('')}

    <div class="calc-card" id="childpugh-card" style="margin-top:6px;"></div>
  `;
  buildChildPughCard(document.getElementById('childpugh-card'));
}

function buildChildPughCard(card) {
  const calc = CALCULATORS.childPugh;
  card.innerHTML = `
    <h3>${esc(calc.name)}</h3>
    <p class="summary">${esc(calc.summary)}</p>
    ${calc.inputs.map((inp) => `
      <label for="cp-${inp.id}">${esc(inp.label)}</label>
      <select id="cp-${inp.id}">
        ${inp.options.map((o) => `<option value="${o.value}">${esc(o.label)}</option>`).join('')}
      </select>
    `).join('')}
    <button class="compute-btn">計算</button>
    <div class="calc-result"></div>
    <ul class="cutoff-list">
      ${calc.classes.map((c) => `<li><b>${esc(c.cls)}(${esc(c.range)})</b> — ${esc(c.detail)}</li>`).join('')}
    </ul>
    <div class="he-grade-box">
      <div class="he-grade-title">肝性腦病變臨床分級參考(West Haven)</div>
      <table class="he-grade-table">
        <tbody>
          ${calc.encephalopathyGrades.map((g) => `<tr><th>${esc(g.level)}<br>${esc(g.name)}</th><td>${esc(g.detail)}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
  `;
  card.querySelector('.compute-btn').onclick = () => {
    const total = calc.inputs.reduce((sum, inp) => sum + parseInt(document.getElementById(`cp-${inp.id}`).value, 10), 0);
    let cls = calc.classes.find((c) => total <= (c.cls === 'Class A' ? 6 : c.cls === 'Class B' ? 9 : 15));
    const resultEl = card.querySelector('.calc-result');
    resultEl.innerHTML = `總分 = ${total} 分 → ${cls.cls}<span class="verdict">${esc(cls.detail)}</span>`;
    resultEl.classList.add('show');
  };
}

/* ---------------- boot ---------------- */
window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', navigate);
navigate();
