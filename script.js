// CV picker: region x profile -> PDF
const CVS = {
  ksa: { label: "Saudi Arabia", lang: "English", note: "includes nationality and Iqama status" },
  france: { label: "France", lang: "Written in French", note: "for roles in France" },
  switzerland: { label: "Switzerland", lang: "English", note: "for European roles" },
};
const PROFILES = { data: "Data & Analytics", healthcare: "Healthcare Data" };

const state = { region: "ksa", profile: "data" };

// Smart default: guess the region from the visitor's time zone, or from ?cv=france-healthcare
function initialState() {
  try {
    const p = new URLSearchParams(location.search).get("cv");
    if (p) {
      const [r, pr] = p.split("-");
      if (CVS[r]) state.region = r;
      if (PROFILES[pr]) state.profile = pr;
      return;
    }
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz === "Europe/Paris") state.region = "france";
    else if (tz === "Europe/Zurich") state.region = "switzerland";
    else if (tz.startsWith("Europe/")) state.region = "switzerland";
    else state.region = "ksa";
  } catch (e) { /* keep defaults */ }
}

function render() {
  document.querySelectorAll("[data-region]").forEach(b => {
    const on = b.dataset.region === state.region;
    b.classList.toggle("active", on); b.setAttribute("aria-checked", on);
  });
  document.querySelectorAll("[data-profile]").forEach(b => {
    const on = b.dataset.profile === state.profile;
    b.classList.toggle("active", on); b.setAttribute("aria-checked", on);
  });
  const c = CVS[state.region];
  document.getElementById("cv-title").textContent = `CV · ${PROFILES[state.profile]} · ${c.label}`;
  document.getElementById("cv-meta").textContent = `${c.lang}, ${c.note} · PDF`;
  const link = document.getElementById("cv-link");
  link.href = `assets/cv/hana-fkiri-cv-${state.region}-${state.profile}.pdf`;
  link.setAttribute("download", `Hana_Fkiri_CV_${c.label.replace(" ", "_")}_${state.profile}.pdf`);
}

document.querySelectorAll("[data-region]").forEach(b =>
  b.addEventListener("click", () => { state.region = b.dataset.region; render(); }));
document.querySelectorAll("[data-profile]").forEach(b =>
  b.addEventListener("click", () => { state.profile = b.dataset.profile; render(); }));

initialState();
render();

// Copy email
document.querySelectorAll(".copy-btn").forEach(btn => btn.addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(btn.dataset.copy); btn.textContent = "Copied"; }
  catch (e) { btn.textContent = "Select and copy"; }
  setTimeout(() => (btn.textContent = "Copy"), 1800);
}));

// Contact form -> email app (only what the visitor wrote, nothing added)
document.getElementById("contact-form").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  location.href = `mailto:hana.fkiri13@gmail.com?body=${encodeURIComponent(f.get("message"))}`;
});

// ===== Deliverable details (modal) =====
const DELIVERABLES = {
  hajj: {
    client: "MOH · NHEOC", title: "Hajj 1447 Real-Time Dashboard (EP71)",
    images: ["assets/img/nheoc-hajj-ep71.jpg"],
    context: "During Hajj 1447, NHEOC needed live visibility on its 71 emergency points across the holy sites.",
    did: "Built a real-time command center dashboard covering site readiness at Arafat, Mina and Muzdalifah, live critical incidents, resolution and on-time closure rates, escalations, an operational map of hotspots, and the share of patients treated on site versus transferred to hospital.",
    result: "In production and used live during Hajj: emergencies were visible in real time, so the operations team could act immediately."
  },
  ambulance: {
    client: "MOH · NHEOC", title: "Ambulance Readiness Dashboard",
    images: ["assets/img/nheoc-ambulance-overview.jpg", "assets/img/nheoc-ambulance-hospitals.jpg"],
    context: "In the current regional context, NHEOC's Emergency Operations department needed to track the readiness and availability of ambulances across the Kingdom.",
    did: "Built an Arabic Power BI dashboard showing ambulance readiness and availability, with views by region, by hospital, and for MOH hospitals only.",
    result: "Delivered and live: the department gets a national, real-time view of ambulance capacity to support emergency response decisions."
  },
  escalation: {
    client: "MOH · NHEOC", title: "Recurrent Incident Escalation Report",
    images: ["assets/img/nheoc-escalation-report.png"],
    context: "NHEOC needed to spot incidents that keep recurring in the same region and facility, so they don't go unnoticed.",
    did: "Built a report that tracks recurring incidents by region and facility over a rolling 3 months, and assigns a direct escalation level based on how often they recur: 1 = monitor, 2 = follow-up, 3 or more = critical.",
    result: "Teams see at once which facilities need attention and can act immediately, without digging through incident lists."
  },
  compliance: {
    client: "MOH · NHEOC", title: "Monthly Data Compliance Report",
    images: ["assets/img/nheoc-compliance-report.png"],
    context: "Every month, the stakeholder had to check the system region by region to see who had submitted their data, then track it in a manual Excel file.",
    did: "Built a report showing, for each region, whether its data is complete and on time, with the last update date and the overall compliance split.",
    result: "No more manual check. The stakeholder sees at once which regions are missing and sends them the report directly."
  },
  scorecard: {
    client: "KFSHRC · Supply Chain", title: "Supplier Performance Scorecard",
    images: ["assets/img/kfshrc-supplier-scorecard.jpg"],
    context: "One pillar of the program is improving suppliers: reliable suppliers, competitive pricing and timely delivery. But KFSHRC had no objective way to measure supplier performance.",
    did: "Delivered, as a proof of concept, a Power BI scorecard rating every supplier on 5 KPIs against targets (on-time delivery, in-full delivery, competitive price, SLA compliance, quality acceptance), with a total score, a segment (preferred, needing improvement, underperforming), the trend versus the previous period, and the top and bottom 10. Designed it as a governance tool, linking scores to contracts, SLAs, penalties and audit.",
    result: "POC signed by the client, who found it simple and immediately useful. Next step: connecting it to live data and onboarding suppliers."
  },
  expedite: {
    client: "KFSHRC · Supply Chain", title: "Expedite Planning Tool",
    figure: ["2 days → 5 min", "Excel VBA automation"],
    context: "Planners spent more than two days identifying which purchase orders to expedite.",
    did: "Built an Excel VBA tool applying stock coverage and delivery rules across 36 product categories, with a user guide for the planning team.",
    result: "A task of 2+ days now takes 5 minutes."
  },
  realloc: {
    client: "HHC · Supply Chain", title: "Stock Reallocation Engine",
    images: ["assets/img/hhc-reallocation-overview.jpg", "assets/img/hhc-reallocation-transfer-plan.jpg", "assets/img/hhc-reallocation-engine.jpg"],
    context: "Some hospital clusters held excess or near-expiry stock while others ran out of the same items.",
    did: "On my own initiative, built a Python and Streamlit dashboard across 20 hospital clusters. It matches excess stock with shortages, prioritizing zero-stock items and the closest donor cluster, and skips receivers that already have an open purchase order. Three pages: availability before and after reallocation, the transfer plan with a donor to receiver matrix, and a network map of the transfers, with an Excel export.",
    result: "A first run identified around SAR 200M of stock that could be reallocated."
  },
  nlp: {
    client: "HHC · E1 Lab", title: "NLP Price Matching",
    figure: ["700+ tests", "matched to tender prices with NLP"],
    context: "A new reference lab planned to bring specialized tests (oncology, NGS, genetics) in-house instead of sending them abroad. Finance needed a price for each test.",
    did: "Extracted NUPCO tender and pricing data from PDFs in Python and matched it to a list of 700+ target tests using sentence transformers, estimating the price of each kit.",
    result: "The finance team used this price base for its cost analysis."
  }
};

const modal = document.getElementById("modal");
let current = null, page = 0, lastFocus = null;
const $ = id => document.getElementById(id);

function showPage() {
  const d = DELIVERABLES[current], imgs = d.images || [];
  if (imgs.length) {
    $("m-img").src = imgs[page]; $("m-img").alt = `${d.title}, page ${page + 1}`;
    $("m-link").href = imgs[page]; $("m-link").hidden = false; $("m-figure").hidden = true;
  } else {
    $("m-link").hidden = true; $("m-figure").hidden = false;
    $("m-figure").innerHTML = `<b>${d.figure[0]}</b><small>${d.figure[1]}</small>`;
  }
  $("m-nav").hidden = imgs.length < 2;
  $("m-page").textContent = `Page ${page + 1} of ${imgs.length}`;
}
function openModal(id) {
  current = id; page = 0; lastFocus = document.activeElement;
  const d = DELIVERABLES[id];
  $("m-client").textContent = d.client; $("m-title").textContent = d.title;
  $("m-context").textContent = d.context; $("m-did").textContent = d.did; $("m-result").textContent = d.result;
  showPage(); modal.hidden = false; document.body.style.overflow = "hidden";
  modal.querySelector(".modal-close").focus();
}
function closeModal() { modal.hidden = true; document.body.style.overflow = ""; if (lastFocus) lastFocus.focus(); }
function step(n) { const k = (DELIVERABLES[current].images || []).length; if (k > 1) { page = (page + n + k) % k; showPage(); } }

document.querySelectorAll(".deliv").forEach(b => b.addEventListener("click", () => openModal(b.dataset.id)));
modal.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", closeModal));
$("m-prev").addEventListener("click", () => step(-1));
$("m-next").addEventListener("click", () => step(1));
document.addEventListener("keydown", e => {
  if (modal.hidden) return;
  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowRight") step(1);
  if (e.key === "ArrowLeft") step(-1);
});
/* ===== CLIENT BLOCKS ===== */
.client { border-top: 1px solid var(--line-strong); padding: 36px 0 44px; }
.client-head { max-width: 900px; margin-bottom: 26px; }
.client-head h3 { margin: 10px 0 14px; font-size: 26px; font-weight: 600; letter-spacing: -0.03em; }
.client-context, .client-role { margin: 0 0 10px; color: var(--muted); font-size: 15px; line-height: 1.7; }
.client-role b { color: var(--text-soft); font-weight: 600; }
.deliverables { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 18px; }
.deliv { display: flex; flex-direction: column; text-align: left; padding: 0; cursor: pointer; border: 1px solid var(--line); border-radius: 10px; overflow: hidden; background: rgba(8, 28, 48, 0.35); color: var(--text); font-family: inherit; transition: transform .2s ease, border-color .2s ease; }
.deliv:hover, .deliv:focus-visible { transform: translateY(-2px); border-color: rgba(136, 199, 255, 0.7); outline: none; }
.deliv-thumb { position: relative; display: block; aspect-ratio: 16 / 9; background: #0b1a2b; overflow: hidden; }
.deliv-thumb img { width: 100%; height: 100%; object-fit: cover; object-position: top left; display: block; }
.deliv-thumb .pages { position: absolute; right: 8px; bottom: 8px; padding: 3px 8px; border-radius: 999px; background: rgba(3, 13, 23, 0.85); color: var(--blue-soft); font-size: 11px; font-weight: 600; }
.deliv-figure { display: flex; flex-direction: column; justify-content: center; padding: 18px; background: radial-gradient(circle at 70% 20%, rgba(45, 128, 226, 0.18), transparent 50%), #0b1a2b; }
.deliv-figure b { color: var(--blue); font-size: 30px; font-weight: 600; letter-spacing: -0.03em; }
.deliv-figure small { margin-top: 6px; color: var(--text-soft); font-size: 13px; }
.deliv-title { padding: 14px 16px 4px; font-size: 15px; font-weight: 600; }
.deliv-more { padding: 0 16px 14px; color: var(--blue-soft); font-size: 12px; }

/* ===== MODAL ===== */
.modal { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 24px; }
.modal[hidden] { display: none; }
.modal-backdrop { position: absolute; inset: 0; background: rgba(1, 6, 12, 0.82); backdrop-filter: blur(4px); }
.modal-box { position: relative; width: min(1180px, 100%); max-height: calc(100vh - 48px); overflow: auto; display: grid; grid-template-columns: 1.6fr 1fr; border: 1px solid var(--line-strong); border-radius: 12px; background: #061524; }
.modal-close { position: absolute; top: 10px; right: 12px; z-index: 2; width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--line-strong); background: rgba(3, 13, 23, 0.8); color: var(--text); font-size: 22px; cursor: pointer; }
.modal-media { padding: 18px; display: flex; flex-direction: column; justify-content: center; background: #0b1a2b; }
.modal-media img { width: 100%; height: auto; display: block; border-radius: 6px; cursor: zoom-in; }
.modal-figure { display: flex; flex-direction: column; justify-content: center; min-height: 260px; padding: 24px; }
.modal-figure[hidden], #m-link[hidden], .modal-nav[hidden] { display: none; }
.modal-figure b { color: var(--blue); font-size: clamp(36px, 4vw, 56px); font-weight: 600; letter-spacing: -0.04em; }
.modal-figure small { margin-top: 10px; color: var(--text-soft); font-size: 15px; }
.modal-nav { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 12px; color: var(--muted); font-size: 13px; }
.modal-nav button { width: 38px; height: 38px; border-radius: 50%; border: 1px solid var(--line-strong); background: transparent; color: var(--text); font-size: 22px; cursor: pointer; }
.modal-nav button:hover { border-color: var(--blue); }
.modal-text { padding: 30px 28px; }
.modal-text h3 { margin: 10px 0 20px; font-size: 24px; font-weight: 600; letter-spacing: -0.03em; line-height: 1.2; }
.modal-text .car { grid-template-columns: 1fr; gap: 2px; }
.modal-text .car dd { margin-bottom: 14px; }
@media (max-width: 900px) { .modal-box { grid-template-columns: 1fr; } .modal { padding: 12px; } }
