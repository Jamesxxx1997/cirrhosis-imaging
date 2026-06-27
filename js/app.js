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

    <div style="margin:18px 0 8px;padding:8px 14px;background:var(--teal-900);color:#fff;border-radius:8px;font-weight:700;font-size:15px;">
      肝硬化 Cirrhosis — 影像徵象
    </div>

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

    <div style="margin:28px 0 8px;padding:8px 14px;background:var(--teal-700);color:#fff;border-radius:8px;font-weight:700;font-size:15px;">
      Parenchymal Liver Disease / Chronic Liver Disease — 超音波評分
    </div>

    <div class="section-card" style="margin-bottom:16px;">
      <p style="font-size:13px;color:var(--ink-soft);margin:0 0 12px;">評估三個超音波特徵（肝緣、肝表面、肝實質紋理），<b>左右肝葉分別打分後取平均</b>，三項平均分相加為總分（0–8）。<br>高頻（5–12 MHz）偵測輕度變化；低頻（2–5 MHz）確認重度變化。</p>
      <table style="width:100%;border-collapse:collapse;font-size:12.5px;">
        <tr style="background:var(--teal-100);"><th style="padding:6px 8px;text-align:left;border:1px solid var(--line);">特徵</th><th style="padding:6px 8px;border:1px solid var(--line);">0 分</th><th style="padding:6px 8px;border:1px solid var(--line);">1 分</th><th style="padding:6px 8px;border:1px solid var(--line);">2 分</th><th style="padding:6px 8px;border:1px solid var(--line);">3 分</th><th style="padding:6px 8px;border:1px solid var(--line);">範圍</th></tr>
        <tr><td style="padding:5px 8px;border:1px solid var(--line);font-weight:700;">肝緣 Liver edge</td><td style="padding:5px 8px;border:1px solid var(--line);">銳利（高頻）</td><td style="padding:5px 8px;border:1px solid var(--line);">輕度鈍化（高頻）</td><td style="padding:5px 8px;border:1px solid var(--line);">明顯鈍化（低頻）</td><td style="padding:5px 8px;border:1px solid var(--line);color:#9ca3af;">—</td><td style="padding:5px 8px;border:1px solid var(--line);">0–2</td></tr>
        <tr style="background:#f9fafb;"><td style="padding:5px 8px;border:1px solid var(--line);font-weight:700;">肝表面 Liver surface</td><td style="padding:5px 8px;border:1px solid var(--line);">平滑（高頻）</td><td style="padding:5px 8px;border:1px solid var(--line);">輕度不規則（高頻）</td><td style="padding:5px 8px;border:1px solid var(--line);">不規則（低頻）</td><td style="padding:5px 8px;border:1px solid var(--line);">高度不規則（低頻）</td><td style="padding:5px 8px;border:1px solid var(--line);">0–3</td></tr>
        <tr><td style="padding:5px 8px;border:1px solid var(--line);font-weight:700;">肝實質紋理 Texture</td><td style="padding:5px 8px;border:1px solid var(--line);">細緻（高頻）</td><td style="padding:5px 8px;border:1px solid var(--line);">輕度粗糙（高頻）</td><td style="padding:5px 8px;border:1px solid var(--line);">粗糙（低頻）</td><td style="padding:5px 8px;border:1px solid var(--line);">高度粗糙（低頻）</td><td style="padding:5px 8px;border:1px solid var(--line);">0–3</td></tr>
      </table>
      <p style="font-size:11.5px;color:var(--ink-soft);margin:6px 0 0;">技巧：肝實質 coarse 判斷可與脾臟比較，若回音差不多則相對正常。</p>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:16px;">
      <div class="section-card" style="padding:12px;">
        <div style="font-size:12px;font-weight:700;color:var(--teal-700);margin-bottom:6px;">Fig 1 — 肝緣 Liver Edge</div>
        <img src="assets/pld_fig1_edge.jpg" style="width:100%;border-radius:6px;border:1px solid var(--line);" alt="Liver edge scoring">
        <p style="font-size:11px;color:var(--ink-soft);margin:5px 0 0;">(a) 銳利 0 · (b) 輕度鈍化 1 (高頻) · (c) 明顯鈍化 2 (低頻)</p>
      </div>
      <div class="section-card" style="padding:12px;">
        <div style="font-size:12px;font-weight:700;color:var(--teal-700);margin-bottom:6px;">Fig 2 — 肝表面 Liver Surface</div>
        <img src="assets/pld_fig2_surface.jpg" style="width:100%;border-radius:6px;border:1px solid var(--line);" alt="Liver surface scoring">
        <p style="font-size:11px;color:var(--ink-soft);margin:5px 0 0;">(a) 平滑 0 · (b) 輕度不規則 1 · (c) 不規則 2 · (d) 高度不規則 3 (低頻)</p>
      </div>
      <div class="section-card" style="padding:12px;">
        <div style="font-size:12px;font-weight:700;color:var(--teal-700);margin-bottom:6px;">Fig 3 — 肝實質紋理 Parenchymal Texture</div>
        <img src="assets/pld_fig3_texture.jpg" style="width:100%;border-radius:6px;border:1px solid var(--line);" alt="Parenchymal texture scoring">
        <p style="font-size:11px;color:var(--ink-soft);margin:5px 0 0;">(a) 細緻 0 · (b) 輕度粗糙 1 · (c) 粗糙 2 · (d) 高度粗糙 3 (低頻)</p>
      </div>
    </div>

    <div class="calc-card" style="margin-bottom:16px;">
      <h3>計算機 US Score Calculator</h3>
      <p class="summary">左右肝葉各打一分 → 自動計算三項平均並加總 → 判斷結果</p>

      <div style="margin-bottom:14px;">
        <div style="font-size:13px;font-weight:700;color:var(--teal-700);margin-bottom:6px;">① 肝緣 Liver Edge　<span style="font-weight:400;font-size:11.5px;color:var(--ink-soft);">高頻 0–1 / 低頻 2</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr 80px;gap:10px;align-items:end;">
          <div><label for="ci_edge_r">右肝 Right</label>
            <select id="ci_edge_r" onchange="pldCalcCI()">
              <option value="">— 選擇 —</option>
              <option value="0">0 — 銳利</option>
              <option value="1">1 — 輕度鈍化</option>
              <option value="2">2 — 明顯鈍化</option>
            </select></div>
          <div><label for="ci_edge_l">左肝 Left</label>
            <select id="ci_edge_l" onchange="pldCalcCI()">
              <option value="">— 選擇 —</option>
              <option value="0">0 — 銳利</option>
              <option value="1">1 — 輕度鈍化</option>
              <option value="2">2 — 明顯鈍化</option>
            </select></div>
          <div style="text-align:center;padding-bottom:6px;">
            <div style="font-size:11px;color:var(--ink-soft);font-weight:700;">平均</div>
            <div id="ci_edge_avg" style="font-size:1.4rem;font-weight:800;color:var(--teal-700);">—</div>
          </div>
        </div>
      </div>

      <div style="margin-bottom:14px;">
        <div style="font-size:13px;font-weight:700;color:var(--teal-700);margin-bottom:6px;">② 肝表面 Liver Surface　<span style="font-weight:400;font-size:11.5px;color:var(--ink-soft);">高頻 0–1 / 低頻 2–3</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr 80px;gap:10px;align-items:end;">
          <div><label for="ci_surf_r">右肝 Right</label>
            <select id="ci_surf_r" onchange="pldCalcCI()">
              <option value="">— 選擇 —</option>
              <option value="0">0 — 平滑</option>
              <option value="1">1 — 輕度不規則</option>
              <option value="2">2 — 不規則</option>
              <option value="3">3 — 高度不規則</option>
            </select></div>
          <div><label for="ci_surf_l">左肝 Left</label>
            <select id="ci_surf_l" onchange="pldCalcCI()">
              <option value="">— 選擇 —</option>
              <option value="0">0 — 平滑</option>
              <option value="1">1 — 輕度不規則</option>
              <option value="2">2 — 不規則</option>
              <option value="3">3 — 高度不規則</option>
            </select></div>
          <div style="text-align:center;padding-bottom:6px;">
            <div style="font-size:11px;color:var(--ink-soft);font-weight:700;">平均</div>
            <div id="ci_surf_avg" style="font-size:1.4rem;font-weight:800;color:var(--teal-700);">—</div>
          </div>
        </div>
      </div>

      <div style="margin-bottom:14px;">
        <div style="font-size:13px;font-weight:700;color:var(--teal-700);margin-bottom:6px;">③ 肝實質紋理 Parenchymal Texture　<span style="font-weight:400;font-size:11.5px;color:var(--ink-soft);">高頻 0–1 / 低頻 2–3</span></div>
        <div style="display:grid;grid-template-columns:1fr 1fr 80px;gap:10px;align-items:end;">
          <div><label for="ci_tex_r">右肝 Right</label>
            <select id="ci_tex_r" onchange="pldCalcCI()">
              <option value="">— 選擇 —</option>
              <option value="0">0 — 細緻</option>
              <option value="1">1 — 輕度粗糙</option>
              <option value="2">2 — 粗糙</option>
              <option value="3">3 — 高度粗糙</option>
            </select></div>
          <div><label for="ci_tex_l">左肝 Left</label>
            <select id="ci_tex_l" onchange="pldCalcCI()">
              <option value="">— 選擇 —</option>
              <option value="0">0 — 細緻</option>
              <option value="1">1 — 輕度粗糙</option>
              <option value="2">2 — 粗糙</option>
              <option value="3">3 — 高度粗糙</option>
            </select></div>
          <div style="text-align:center;padding-bottom:6px;">
            <div style="font-size:11px;color:var(--ink-soft);font-weight:700;">平均</div>
            <div id="ci_tex_avg" style="font-size:1.4rem;font-weight:800;color:var(--teal-700);">—</div>
          </div>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;background:var(--teal-50);border-radius:8px;padding:14px 16px;border:1.5px solid #b2dfdb;">
        <div style="text-align:center;min-width:80px;">
          <div style="font-size:11px;color:var(--ink-soft);font-weight:700;text-transform:uppercase;letter-spacing:.05em;">總分</div>
          <div id="ci_total" style="font-size:2.4rem;font-weight:800;color:var(--teal-900);">—</div>
          <div style="font-size:10px;color:#9ca3af;">max 8</div>
        </div>
        <div id="ci_result" style="flex:1;font-size:13px;line-height:1.6;min-width:180px;color:var(--ink);">
          <span style="color:#9ca3af;">填入六個欄位後自動計算。</span>
        </div>
      </div>
    </div>

    <div style="background:#fef3e2;border:1px solid #fde68a;border-radius:8px;padding:11px 14px;font-size:12px;color:#92400e;line-height:1.5;margin-bottom:8px;">
      <b>Reference</b>：Saverymuttu SH, Joseph AEA, Maxwell JD. "Ultrasound scanning in the detection of hepatic fibrosis and steatosis." <i>Br Med J (Clin Res Ed)</i> 1986;292:13–15. · 臨界值 ≥ 6.5 對肝硬化特異度 100%（單一研究）；臨床判讀請結合 FIB-4 / APRI / Fibroscan。
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

/* ---------------- PLD calculator ---------------- */
function pldCalcCI() {
  const ids = ['ci_edge_r','ci_edge_l','ci_surf_r','ci_surf_l','ci_tex_r','ci_tex_l'];
  const els = ids.map((id) => document.getElementById(id));
  if (els.some((e) => !e)) return;
  const [er, el, sr, sl, tr_, tl] = els.map((e) => e.value);
  const edgeAvg = (er !== '' && el  !== '') ? (parseFloat(er)  + parseFloat(el))  / 2 : null;
  const surfAvg = (sr !== '' && sl  !== '') ? (parseFloat(sr)  + parseFloat(sl))  / 2 : null;
  const texAvg  = (tr_ !== '' && tl !== '') ? (parseFloat(tr_) + parseFloat(tl))  / 2 : null;
  const avgEl = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v !== null ? v.toFixed(1) : '—'; };
  avgEl('ci_edge_avg', edgeAvg);
  avgEl('ci_surf_avg', surfAvg);
  avgEl('ci_tex_avg',  texAvg);
  if (edgeAvg !== null && surfAvg !== null && texAvg !== null) {
    const total = edgeAvg + surfAvg + texAvg;
    const totEl = document.getElementById('ci_total');
    const resEl = document.getElementById('ci_result');
    if (!totEl || !resEl) return;
    totEl.textContent = total.toFixed(1);
    let color, html;
    if (total >= 6.5) {
      color = '#b91c1c';
      html = '<b style="color:' + color + '">肝硬化 Cirrhosis（Stage F4）</b><br>總分 ≥ 6.5 — 研究中所有病人均為第 4 期纖維化，作者認為此分數對肝硬化具 <b>100% 特異度</b>。建議積極追蹤並轉介肝臟科。';
    } else if (total > 0) {
      color = '#d97706';
      html = '<b style="color:' + color + '">慢性肝病變 Chronic liver disease</b><br>總分 &gt; 0 代表有肝實質變化。分數 &lt; 6.5 不排除輕至中度纖維化，請結合 FIB-4 / APRI / Fibroscan 及臨床判讀。';
    } else {
      color = '#047857';
      html = '<b style="color:' + color + '">正常 Normal</b><br>三項特徵均無異常，超音波上無慢性肝病變表現。';
    }
    totEl.style.color = color;
    resEl.innerHTML = html;
  }
}

/* ---------------- boot ---------------- */
window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', navigate);
navigate();
