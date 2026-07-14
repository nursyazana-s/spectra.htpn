<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>SPECTRA — Screening Questionnaire</title>
<link rel="stylesheet" href="../css/main.css"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet"/>
</head>
<body>
<div id="spectra-chrome"></div>

<div class="page-shell">
  <button class="back-link" id="backBtn">← <span id="backLabel">Back</span></button>
  <div class="section-meta">
    <span id="sectionMeta">Section 1 of 9</span>
  </div>
  <div class="progress-track"><div class="progress-fill" id="progressFill" style="width:0%"></div></div>

  <div class="card">
    <div class="card-emoji" id="sectionEmoji">👂</div>
    <h2 class="card-title" id="sectionTitle">Auditory</h2>
    <div id="itemsWrap"></div>
    <button class="btn-primary" id="nextBtn" disabled>Continue</button>
  </div>
</div>

<script src="../js/spectra.js"></script>
<script>
const draft = JSON.parse(sessionStorage.getItem("spectra_draft") || "null");
if (!draft) { window.location.href = "parent-form.html"; }

let sectionIdx = parseInt(sessionStorage.getItem("spectra_section_idx") || "0", 10);
let answers = JSON.parse(sessionStorage.getItem("spectra_answers") || "{}");

const SCALE = [
  { v: 5, key: "scaleAlmostAlways", emoji: "🟥" },
  { v: 4, key: "scaleFrequently", emoji: "🟧" },
  { v: 3, key: "scaleHalf", emoji: "🟨" },
  { v: 2, key: "scaleOccasionally", emoji: "🟩" },
  { v: 1, key: "scaleAlmostNever", emoji: "🟦" },
  { v: 0, key: "scaleNA", emoji: "⬜" },
];

function renderSection(){
  const tt = t();
  const lang = getLang();
  const secKey = SECTION_ORDER[sectionIdx];
  const section = ITEM_BANK[secKey];

  document.getElementById("backLabel").textContent = tt.back;
  document.getElementById("sectionMeta").textContent = `${tt.sectionWord} ${sectionIdx+1} ${tt.ofWord} ${SECTION_ORDER.length}`;
  document.getElementById("progressFill").style.width = ((sectionIdx) / SECTION_ORDER.length * 100) + "%";
  document.getElementById("sectionEmoji").textContent = section.emoji;
  document.getElementById("sectionTitle").textContent = lang==="en" ? section.label_en : section.label_bm;

  const wrap = document.getElementById("itemsWrap");
  wrap.innerHTML = section.items.map(item => `
    <div class="item-block">
      <p class="item-text">${lang==="en" ? item.en : item.bm}</p>
      <div class="scale-row" data-item="${item.id}">
        ${SCALE.map(s => `<button type="button" class="scale-btn ${answers[item.id]===s.v?'selected':''}" data-val="${s.v}">${s.emoji} ${tt[s.key]}</button>`).join("")}
      </div>
    </div>
  `).join("");

  wrap.querySelectorAll(".scale-row").forEach(row => {
    const itemId = row.dataset.item;
    row.querySelectorAll(".scale-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        answers[itemId] = parseInt(btn.dataset.val, 10);
        sessionStorage.setItem("spectra_answers", JSON.stringify(answers));
        row.querySelectorAll(".scale-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        checkComplete();
      });
    });
  });

  const nextBtn = document.getElementById("nextBtn");
  nextBtn.textContent = (sectionIdx === SECTION_ORDER.length - 1)
    ? tt.submit
    : tt.continue;
  checkComplete();
}

function checkComplete(){
  const secKey = SECTION_ORDER[sectionIdx];
  const section = ITEM_BANK[secKey];
  const complete = section.items.every(it => answers[it.id] !== undefined);
  document.getElementById("nextBtn").disabled = !complete;
}

document.getElementById("backBtn").addEventListener("click", () => {
  if (sectionIdx === 0) { window.location.href = "parent-form.html"; }
  else { sectionIdx--; sessionStorage.setItem("spectra_section_idx", sectionIdx); renderSection(); }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  if (sectionIdx < SECTION_ORDER.length - 1) {
    sectionIdx++;
    sessionStorage.setItem("spectra_section_idx", sectionIdx);
    renderSection();
    window.scrollTo(0,0);
  } else {
    submitScreening();
  }
});

function submitScreening(){
  const { sectionScores, quadrantScores } = computeScores(answers);
  const patient = {
    id: uid(),
    ...draft,
    answers,
    sectionScores,
    quadrantScores,
    status: "pending",
    submittedAt: Date.now(),
    clinicalSummary: "",
    homeProgramme: [],
  };
  patient.clinicalSummary = generateSummary(patient);
  patient.homeProgramme = draftHomeProgramme(sectionScores);
  savePatient(patient);

  sessionStorage.removeItem("spectra_draft");
  sessionStorage.removeItem("spectra_answers");
  sessionStorage.removeItem("spectra_section_idx");

  window.location.href = "parent-submitted.html";
}

renderSection();
</script>
</body>
</html>
