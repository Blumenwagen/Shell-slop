/**
 * Atlas quality harness.
 *
 * Run: node --experimental-strip-types scripts/verify-atlas.mjs
 *
 * Asserts, for every atlas quest:
 *  1. The solution parses as structurally valid QML (course parser).
 *  2. The solution passes all three of the quest's checks (comment-stripped).
 *  3. The starter does NOT already pass all three checks (there is work to do).
 *  4. Quizzes have 4 distinct options and an in-range answer.
 *  5. Exercise-override keys correspond to real quest ids.
 *
 * Known intentional exception: grammar-error-compass ships a deliberately
 * broken starter, so its starter (not solution) may carry parse errors.
 */
import { atlasQuestSeeds } from "../app/course/atlas.ts";
import { ATLAS_EXERCISES } from "../app/course/exercises/index.ts";
import { stripQmlComments } from "../app/course/editor.ts";
import { parseQml } from "../app/course/qmlAst.ts";

let failures = 0;
const fail = (message) => { failures += 1; console.log(`FAIL ${message}`); };

const questIds = new Set(atlasQuestSeeds.map(seed => seed.id));
for (const key of Object.keys(ATLAS_EXERCISES)) {
  if (!questIds.has(key)) fail(`exercise override "${key}" matches no quest id`);
}

for (const seed of atlasQuestSeeds) {
  const solutionDoc = parseQml(seed.solution);
  if (!solutionDoc.root || solutionDoc.errors.length > 0) {
    fail(`${seed.id}: solution has parse issues: ${JSON.stringify(solutionDoc.errors.slice(0, 2))}`);
  }

  const compiled = seed.checks.map(check => new RegExp(check.pattern, (check.flags ?? "").replaceAll("g", "")));
  const solutionCode = stripQmlComments(seed.solution);
  compiled.forEach((expression, index) => {
    if (!expression.test(solutionCode)) fail(`${seed.id}: solution fails check #${index + 1} "${seed.checks[index].label}" pattern=${seed.checks[index].pattern}`);
  });

  const starterCode = stripQmlComments(seed.starter);
  if (compiled.every(expression => expression.test(starterCode))) {
    fail(`${seed.id}: starter already passes all checks — no work left for the learner`);
  }

  for (const quiz of seed.quizzes) {
    if (new Set(quiz.options).size !== 4) fail(`${seed.id} quiz ${quiz.id}: duplicate options`);
    if (quiz.answer < 0 || quiz.answer > 3) fail(`${seed.id} quiz ${quiz.id}: answer out of range`);
  }
}

const covered = atlasQuestSeeds.filter(seed => ATLAS_EXERCISES[seed.id] || seed.id === "grammar-error-compass" || seed.id === "binding-repair-clinic" || seed.id === "value-toolchest");
const byCampaign = new Map();
for (const seed of atlasQuestSeeds) {
  const entry = byCampaign.get(seed.campaign) ?? { total: 0, covered: 0 };
  entry.total += 1;
  if (covered.includes(seed)) entry.covered += 1;
  byCampaign.set(seed.campaign, entry);
}
console.log("authored-exercise coverage (blueprint overrides count as authored):");
for (const [campaign, entry] of [...byCampaign.entries()].sort()) {
  console.log(`  campaign ${campaign}: ${entry.covered}/${entry.total}`);
}

console.log(failures === 0 ? "ATLAS OK" : `${failures} FAILURES`);
process.exit(failures === 0 ? 0 : 1);
