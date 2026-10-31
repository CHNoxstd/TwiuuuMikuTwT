const waveForm = document.querySelector("#wave-controls");
const waveCanvas = document.querySelector("#wave-chart");
const observationForm = document.querySelector("#observation-form");
const notebookRows = document.querySelector("#notebook-rows");
const notebookStatus = document.querySelector("#notebook-status");
const storageKey = "blue-atlas-lab-observations-v1";

const habitatFactors = {
  reef: { label: "Coral reef", attenuation: 0.00155, color: "#57d6f0" },
  mangrove: { label: "Mangrove fringe", attenuation: 0.00105, color: "#87c9f3" },
  seagrass: { label: "Seagrass meadow", attenuation: 0.00072, color: "#a7efff" },
};

function calculateWaveScenario({ habitat, width, wave, level }) {
  const factor = habitatFactors[habitat];
  if (!factor) throw new RangeError("Choose a supported habitat.");

  const normalizedWidth = Math.max(0, Math.min(800, Number(width)));
  const startingWave = Math.max(0.2, Math.min(3, Number(wave)));
  const waterLevel = Math.max(0, Math.min(100, Number(level)));
  const depthModifier = 1 / (1 + waterLevel / 125);
  const reduction = (1 - Math.exp(-factor.attenuation * normalizedWidth * depthModifier)) * 0.48;

  return {
    startingWave,
    endingWave: startingWave * (1 - reduction),
    reductionPercent: reduction * 100,
  };
}

function drawWaveChart(canvas, scenario, habitat) {
  const context = canvas.getContext("2d");
  if (!context) return;

  const ratio = window.devicePixelRatio || 1;
  const bounds = canvas.getBoundingClientRect();
  const width = Math.max(320, bounds.width);
  const height = 245;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  context.scale(ratio, ratio);
  context.clearRect(0, 0, width, height);

  const left = 43;
  const right = width - 18;
  const chartTop = 22;
  const baseline = 184;
  const chartWidth = right - left;
  const maxWave = 3;
  const scaleY = (baseline - chartTop) / maxWave;

  context.font = "10px 'DM Mono', monospace";
  context.textAlign = "right";
  context.textBaseline = "middle";
  for (let mark = 0; mark <= maxWave; mark += 1) {
    const y = baseline - mark * scaleY;
    context.strokeStyle = "rgba(181, 216, 233, .12)";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(left, y);
    context.lineTo(right, y);
    context.stroke();
    context.fillStyle = "#819aaa";
    context.fillText(`${mark.toFixed(1)} m`, left - 8, y);
  }

  const barWidth = Math.min(86, chartWidth * 0.2);
  const firstX = left + chartWidth * 0.22 - barWidth / 2;
  const secondX = left + chartWidth * 0.72 - barWidth / 2;
  const drawBar = (x, value, color, label) => {
    const barHeight = Math.max(1, value * scaleY);
    context.fillStyle = color;
    context.fillRect(x, baseline - barHeight, barWidth, barHeight);
    context.fillStyle = "#e8f3f8";
    context.textAlign = "center";
    context.textBaseline = "bottom";
    context.fillText(`${value.toFixed(2)} m`, x + barWidth / 2, baseline - barHeight - 7);
    context.fillStyle = "#9cabb8";
    context.textBaseline = "top";
    context.fillText(label, x + barWidth / 2, baseline + 10);
  };

  drawBar(firstX, scenario.startingWave, "#28556e", "Incoming");
  drawBar(secondX, scenario.endingWave, habitatFactors[habitat].color, "After habitat");
  context.fillStyle = "#8097a4";
  context.textAlign = "left";
  context.textBaseline = "top";
  context.fillText("ILLUSTRATIVE WAVE HEIGHT", left, height - 19);
}

function updateWaveExperiment() {
  if (!waveForm || !waveCanvas) return;

  const data = new FormData(waveForm);
  const habitat = String(data.get("habitat"));
  const scenario = calculateWaveScenario({
    habitat,
    width: Number(data.get("width")),
    wave: Number(data.get("wave")) / 10,
    level: Number(data.get("level")),
  });

  const widthOutput = document.querySelector("#width-value");
  const waveOutput = document.querySelector("#wave-value");
  const levelOutput = document.querySelector("#level-value");
  if (widthOutput) widthOutput.value = `${Number(data.get("width"))} m`;
  if (waveOutput) waveOutput.value = `${scenario.startingWave.toFixed(1)} m`;
  if (levelOutput) levelOutput.value = `+${Number(data.get("level"))} cm`;

  const startingResult = document.querySelector("#starting-result");
  const endingResult = document.querySelector("#ending-result");
  const changeResult = document.querySelector("#change-result");
  if (startingResult) startingResult.textContent = `${scenario.startingWave.toFixed(2)} m`;
  if (endingResult) endingResult.textContent = `${scenario.endingWave.toFixed(2)} m`;
  if (changeResult) changeResult.textContent = `−${scenario.reductionPercent.toFixed(1)}%`;
  drawWaveChart(waveCanvas, scenario, habitat);
}

function readObservations() {
  const stored = window.localStorage.getItem(storageKey);
  if (!stored) return [];

  const parsed = JSON.parse(stored);
  if (!Array.isArray(parsed)) throw new TypeError("Notebook data is not a valid list.");
  return parsed.filter((record) => record && typeof record.id === "string" && typeof record.site === "string");
}

function writeObservations(records) {
  window.localStorage.setItem(storageKey, JSON.stringify(records));
}

function setNotebookStatus(message, isError = false) {
  if (!notebookStatus) return;
  notebookStatus.textContent = message;
  notebookStatus.classList.toggle("is-error", isError);
}

function escapeCsv(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function renderNotebook() {
  if (!notebookRows) return;

  let records;
  try {
    records = readObservations();
  } catch (error) {
    console.error("Could not read the Blue Atlas notebook.", error);
    setNotebookStatus("Notebook could not be read. Browser storage may be unavailable or corrupted.", true);
    return;
  }

  const filter = document.querySelector("#habitat-filter")?.value ?? "all";
  const visibleRecords = filter === "all" ? records : records.filter((record) => record.habitat === filter);
  notebookRows.replaceChildren();

  if (visibleRecords.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    const cell = document.createElement("td");
    cell.colSpan = 7;
    cell.textContent = records.length === 0 ? "Your notebook is empty. Add a practice observation to begin." : "No observations match this habitat filter.";
    row.append(cell);
    notebookRows.append(row);
    return;
  }

  visibleRecords.forEach((record) => {
    const row = document.createElement("tr");
    [record.date, record.site, record.habitat, record.indicator, `${record.value} ${record.unit}`.trim(), record.notes || "—"].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });

    const actionCell = document.createElement("td");
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("aria-label", `Remove observation at ${record.site}`);
    removeButton.addEventListener("click", () => removeObservation(record.id));
    actionCell.append(removeButton);
    row.append(actionCell);
    notebookRows.append(row);
  });
}

function removeObservation(id) {
  try {
    const records = readObservations().filter((record) => record.id !== id);
    writeObservations(records);
    setNotebookStatus("Observation removed from this browser.");
    renderNotebook();
  } catch (error) {
    console.error("Could not remove the notebook observation.", error);
    setNotebookStatus("Could not update the notebook. Check browser storage settings.", true);
  }
}

waveForm?.addEventListener("input", updateWaveExperiment);
waveForm?.addEventListener("change", updateWaveExperiment);
waveForm?.addEventListener("reset", () => window.requestAnimationFrame(updateWaveExperiment));
window.addEventListener("resize", updateWaveExperiment);
updateWaveExperiment();

observationForm?.elements.date && (observationForm.elements.date.value = new Date().toISOString().slice(0, 10));

observationForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!observationForm.reportValidity()) return;

  const data = new FormData(observationForm);
  const record = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    site: String(data.get("site")).trim(),
    habitat: String(data.get("habitat")),
    indicator: String(data.get("indicator")).trim(),
    value: String(data.get("value")).trim(),
    unit: String(data.get("unit")).trim(),
    date: String(data.get("date")),
    notes: String(data.get("notes")).trim(),
  };

  try {
    const records = readObservations();
    records.unshift(record);
    writeObservations(records);
    observationForm.reset();
    observationForm.elements.date.value = new Date().toISOString().slice(0, 10);
    setNotebookStatus("Observation saved in this browser. It has not been uploaded.");
    renderNotebook();
  } catch (error) {
    console.error("Could not save the Blue Atlas notebook.", error);
    setNotebookStatus("Could not save this observation. Check browser storage settings and available space.", true);
  }
});

document.querySelector("#habitat-filter")?.addEventListener("change", renderNotebook);

document.querySelector("#export-notes")?.addEventListener("click", () => {
  try {
    const records = readObservations();
    if (records.length === 0) {
      setNotebookStatus("Add an observation before exporting the notebook.", true);
      return;
    }

    const columns = ["date", "site", "habitat", "indicator", "value", "unit", "notes"];
    const csv = [columns.map(escapeCsv).join(","), ...records.map((record) => columns.map((column) => escapeCsv(record[column])).join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `blue-atlas-observations-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setNotebookStatus(`${records.length} observation${records.length === 1 ? "" : "s"} exported as CSV.`);
  } catch (error) {
    console.error("Could not export the Blue Atlas notebook.", error);
    setNotebookStatus("Could not export the notebook. Check browser storage settings.", true);
  }
});

document.querySelector("#clear-notes")?.addEventListener("click", () => {
  try {
    const records = readObservations();
    if (records.length === 0) {
      setNotebookStatus("The notebook is already empty.");
      return;
    }
    if (!window.confirm(`Delete all ${records.length} locally saved observations? This cannot be undone.`)) return;
    window.localStorage.removeItem(storageKey);
    setNotebookStatus("Local notebook cleared.");
    renderNotebook();
  } catch (error) {
    console.error("Could not clear the Blue Atlas notebook.", error);
    setNotebookStatus("Could not clear the notebook. Check browser storage settings.", true);
  }
});

renderNotebook();
