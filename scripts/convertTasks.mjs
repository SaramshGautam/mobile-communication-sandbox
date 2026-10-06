import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";

const input = process.argv[2];
const output = process.argv[3] ?? "src/data/generatedTasks.json";

if (!input) {
  console.error("Usage: npm run convert:tasks -- tasks.csv [output.json]");
  process.exit(1);
}

const parsed = Papa.parse(fs.readFileSync(input, "utf8"), {
  header: true,
  skipEmptyLines: "greedy",
  transformHeader: (header) => header.trim().toLowerCase(),
});
if (parsed.errors.length)
  throw new Error(parsed.errors.map((error) => error.message).join("\n"));

const clean = (value = "") => String(value ?? "").trim();
const slug = (value = "") =>
  clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
const split = (value = "") =>
  clean(value)
    .split(/[;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
const isTaskBank = Object.hasOwn(parsed.data[0] ?? {}, "pair id");

let tasks = [];

if (isTaskBank) {
  let currentPairId = "";
  let currentIntent = "";
  let rowWithinPair = 0;

  for (const [index, row] of parsed.data.entries()) {
    if (clean(row["pair id"])) {
      currentPairId = clean(row["pair id"]);
      currentIntent = clean(row["intent family"]);
      rowWithinPair = 0;
    } else {
      rowWithinPair += 1;
    }
    const instruction = clean(row["task goal"]);
    if (!currentPairId || !instruction) continue;

    const platform = rowWithinPair === 0 ? "messaging" : "social";
    tasks.push({
      id: `${currentPairId}-${platform === "messaging" ? "M" : "S"}`,
      pairId: currentPairId,
      platform,
      intentFamily: slug(clean(row["intent family"]) || currentIntent),
      scenario: clean(row.scenario),
      instruction,
      taskDemands: clean(row["task demands"]),
      startState: clean(row["sandbox setup and starting the state"]),
      correctOutcome: clean(row["correct outcome"]),
      difficulty: slug(clean(row["agreed difficulty"]) || "unrated"),
      uiRequirements: clean(row.ui),
      sourceRow: index + 2,
      breakdownTargets: [],
    });
  }
} else {
  const required = [
    "task_pair_id",
    "intent_family",
    "general_intent",
    "feed_instruction",
    "message_instruction",
  ];
  const errors = [];
  tasks = parsed.data.flatMap((row, index) => {
    const missing = required.filter((field) => !clean(row[field]));
    if (missing.length)
      errors.push(`Row ${index + 2}: missing ${missing.join(", ")}`);
    const pairId = clean(row.task_pair_id) || `PAIR_${index + 1}`;
    const shared = {
      pairId,
      intentFamily: slug(row.intent_family),
      scenario: clean(row.general_intent),
      difficulty: slug(row.difficulty || "unrated"),
      breakdownTargets: split(row.breakdown_targets).map(slug),
      correctOutcome: clean(row.completion_state || "completed"),
    };
    return [
      {
        ...shared,
        id: `${pairId}-S`,
        platform: "social",
        instruction: clean(row.feed_instruction),
        startState: slug(row.feed_start_state || "home_feed"),
      },
      {
        ...shared,
        id: `${pairId}-M`,
        platform: "messaging",
        instruction: clean(row.message_instruction),
        startState: slug(row.message_start_state || "conversation_list"),
      },
    ];
  });
  if (errors.length) {
    console.error(`CSV validation failed:\n${errors.join("\n")}`);
    process.exit(1);
  }
}

const taskPairs = Object.values(
  tasks.reduce((groups, task) => {
    groups[task.pairId] ??= {
      pairId: task.pairId,
      intentFamily: task.intentFamily,
      variants: {},
    };
    groups[task.pairId].variants[task.platform] = task;
    return groups;
  }, {})
);

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(
  output,
  JSON.stringify(
    { generatedAt: new Date().toISOString(), tasks, taskPairs },
    null,
    2
  )
);
console.log(
  `Converted ${tasks.length} task variants across ${taskPairs.length} pairs to ${output}`
);
