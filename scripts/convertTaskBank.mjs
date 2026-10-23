// Converts the v2 task bank (one CSV per app, exported from task-bank-v2/TaskBank.xlsx)
// into src/data/scenarios.json.
//
//   npm run convert:tasks
//
// Each scenario is 4 rows: the first row has the Task ID and background
// (Find), followed by Understand, Reply and Share rows with an empty Task ID.
import fs from "node:fs";
import Papa from "papaparse";

const SOURCES = [
  { app: "messenger", suffix: "M", file: "task-bank-v2/messenger.csv" },
  { app: "social", suffix: "S", file: "task-bank-v2/social.csv" },
];
const OUT = process.argv[2] ?? "src/data/scenarios.json";
const clean = (v) => String(v ?? "").replace(/\r/g, "").trim();

const scenarios = [];
for (const src of SOURCES) {
  const parsed = Papa.parse(fs.readFileSync(src.file, "utf8").replace(/^﻿/, ""), {
    header: true, skipEmptyLines: "greedy", transformHeader: (h) => h.trim().toLowerCase(),
  });
  let current = null;
  parsed.data.forEach((row, i) => {
    const rawId = clean(row["task id"]);
    if (rawId) {
      const num = rawId.match(/T(\d+)/i)?.[1];
      if (!num) throw new Error(`${src.file} row ${i + 2}: bad Task ID "${rawId}"`);
      current = {
        id: `T${num.padStart(2, "0")}-${src.suffix}`,
        app: src.app,
        number: Number(num),
        background: clean(row["background & scenario"]),
        steps: [],
      };
      scenarios.push(current);
    }
    if (!current) return;
    const goal = clean(row["task goal"]);
    if (!goal) return;
    const setup = clean(row["sandbox setup and starting the state"]);
    current.steps.push({
      n: current.steps.length + 1,
      intent: clean(row["intent family"]) || ["Find", "Understand", "Reply", "Share"][current.steps.length],
      goal,
      demands: clean(row["task demands"]),
      setup,
      outcome: clean(row["correct outcome"]),
      sourceRow: i + 2,
    });
  });
}
for (const s of scenarios)
  if (s.steps.length !== 4) console.warn(`Warning: ${s.id} has ${s.steps.length} steps`);

fs.writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), scenarios }, null, 2));
console.log(`Wrote ${scenarios.length} scenarios to ${OUT}`);
