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

// Contact form -> email app
document.getElementById("contact-form").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const subject = `Opportunity for Hana Fkiri${f.get("company") ? " · " + f.get("company") : ""}`;
  const body = `${f.get("message")}\n\n${f.get("name")}${f.get("company") ? ", " + f.get("company") : ""}`;
  location.href = `mailto:hana.fkiri13@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
