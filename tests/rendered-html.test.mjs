import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const rootUrl = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("dist/server/index.js", rootUrl);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

async function courseModule(path) {
  const moduleUrl = new URL(path, rootUrl);
  moduleUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  return import(moduleUrl.href);
}

test("server-renders the complete five-map QML Shellcraft atlas", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /QML SHELLCRAFT/);
  assert.match(html, /zero → hero adventure|zero → shellwright/i);
  assert.match(html, /160(?:<!-- -->)? quests/);
  assert.match(html, /Five maps\. One production shell\./);
  assert.match(html, /Awakening Archipelago/);
  assert.match(html, /world-map\.jpg/);
  assert.match(html, /Browser simulation/);
  assert.match(html, /Static QML check/);
  assert.match(html, /Linux runtime/);
  assert.match(html, /Tell QML what exists/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("ships 160 unique quests across five campaigns and thirty regions", async () => {
  const [{ atlasCampaigns, atlasQuestSeeds }, page] = await Promise.all([
    courseModule("app/course/atlas.ts"),
    readFile(new URL("app/page.tsx", rootUrl), "utf8"),
  ]);

  const legacyIds = [...page.matchAll(/^ {4}id: "([^"]+)",/gm)].map((match) => match[1]);
  const regions = atlasCampaigns.flatMap((campaign) => campaign.regions);
  const seedIds = atlasQuestSeeds.map((quest) => quest.id);
  const allIds = [...legacyIds, ...seedIds];

  assert.equal(atlasCampaigns.length, 5);
  assert.deepEqual(atlasCampaigns.map((campaign) => campaign.number), [1, 2, 3, 4, 5]);
  assert.equal(regions.length, 30);
  assert.equal(new Set(regions.map((region) => region.id)).size, 30);
  assert.equal(regions.reduce((sum, region) => sum + region.targetQuestCount, 0), 160);

  assert.equal(legacyIds.length, 26);
  assert.equal(atlasQuestSeeds.length, 134);
  assert.equal(allIds.length, 160);
  assert.equal(new Set(allIds).size, 160);
  assert.deepEqual(
    [1, 2, 3, 4, 5].map((campaign) => atlasQuestSeeds.filter((quest) => quest.campaign === campaign).length),
    [24, 30, 30, 25, 25],
  );

  const knownRegions = new Map(regions.map((region) => [region.id, region]));
  const knownQuestIds = new Set(allIds);
  for (const quest of atlasQuestSeeds) {
    const region = knownRegions.get(quest.regionId);
    assert.ok(region, `${quest.id} references a known region`);
    assert.equal(quest.campaign, region.campaign, `${quest.id} stays in its region's campaign`);
    assert.equal(quest.explanation.length, 3, `${quest.id} has a three-part explanation`);
    assert.equal(quest.checks.length, 3, `${quest.id} has three structural checks`);
    assert.equal(quest.quizzes.length, 6, `${quest.id} has a six-question authored bank`);
    assert.ok(quest.conceptTags.length >= 2, `${quest.id} has useful concept tags`);
    assert.ok(quest.verificationBoundary.trim().length > 20, `${quest.id} explains its verification boundary`);
    assert.ok(quest.supportedQuickshell.trim().length > 0, `${quest.id} pins its Quickshell support`);
    assert.ok(!Number.isNaN(Date.parse(quest.sourceReviewedAt)), `${quest.id} records a source-review date`);
    quest.checks.forEach((check) => assert.doesNotThrow(() => new RegExp(check.pattern, check.flags)));
    quest.prerequisiteIds.forEach((id) => assert.ok(knownQuestIds.has(id), `${quest.id} has known prerequisite ${id}`));
  }

  assert.deepEqual(
    [...new Set(atlasQuestSeeds.map((quest) => quest.executionTier))].sort(),
    ["browser-simulation", "linux-wayland-runtime", "static-qml-check"],
  );
});

test("mastery review modes schedule retrieval and structural diagnostics block malformed QML", async () => {
  const [masteryModule, editorModule, page] = await Promise.all([
    courseModule("app/course/mastery.ts"),
    courseModule("app/course/editor.ts"),
    readFile(new URL("app/page.tsx", rootUrl), "utf8"),
  ]);
  const {
    masteryPercent,
    recordAnswer,
    recordSupportUse,
    selectReviewCandidates,
  } = masteryModule;
  const { analyzeQml, hasBlockingDiagnostics } = editorModule;

  const modes = ["journey", "weak", "due", "campaign", "boss", "all"];
  modes.forEach((mode) => assert.match(page, new RegExp(`id: "${mode}"`)));
  assert.match(page, /selectReviewCandidates/);
  assert.match(page, /recordSupportUse/);

  const now = Date.UTC(2026, 7, 10);
  let mastery = recordAnswer({}, "bindings", false, now);
  mastery = recordAnswer(mastery, "bindings", true, now + 1_000);
  mastery = recordSupportUse(mastery, "bindings", "hint");
  assert.equal(mastery.bindings.attempts, 2);
  assert.equal(mastery.bindings.correct, 1);
  assert.equal(mastery.bindings.hintUses, 1);
  assert.ok(masteryPercent(mastery.bindings) > 0);
  assert.ok(masteryPercent(mastery.bindings) < 100);

  const candidates = [
    { id: "bindings", campaign: 1 },
    { id: "drawer-boss", campaign: 2, boss: true },
    { id: "colour", campaign: 2 },
  ];
  const options = { completed: new Set(["bindings"]), activeCampaign: 2, now: now + 30 * 24 * 60 * 60 * 1_000 };
  assert.deepEqual(selectReviewCandidates(candidates, mastery, "weak", options).map((item) => item.id), ["bindings"]);
  assert.deepEqual(selectReviewCandidates(candidates, mastery, "due", options).map((item) => item.id), ["bindings"]);
  assert.deepEqual(selectReviewCandidates(candidates, mastery, "campaign", options).map((item) => item.id), ["drawer-boss", "colour"]);
  assert.deepEqual(selectReviewCandidates(candidates, mastery, "boss", options).map((item) => item.id), ["drawer-boss"]);
  assert.deepEqual(selectReviewCandidates(candidates, mastery, "journey", options).map((item) => item.id), ["bindings", "drawer-boss"]);
  assert.equal(selectReviewCandidates(candidates, mastery, "all", options).length, 3);

  const malformed = analyzeQml("import QtQuick\nRectangle {\n  id: root\n  id: root\n");
  assert.ok(malformed.some((diagnostic) => /Unclosed/.test(diagnostic.message)));
  assert.ok(malformed.some((diagnostic) => /Duplicate id/.test(diagnostic.message)));
  assert.equal(hasBlockingDiagnostics(malformed), true);

  const unsafe = analyzeQml(`import QtQuick\nimport Quickshell.Io\nItem {\n  property var screen: Quickshell.screens[0]\n  Process { command: "sh -c echo unsafe" }\n}`);
  assert.ok(unsafe.some((diagnostic) => diagnostic.message === "Fixed screen index"));
  assert.ok(unsafe.some((diagnostic) => diagnostic.message === "Process command is a string"));
});

test("Forge exports one coherent 48-file Quickshell project", async () => {
  const {
    createForgeProject,
    FORGE_ARTIFACTS,
    FORGE_CHECKPOINTS,
    getForgeManifest,
    REQUIRED_FORGE_FILES,
    restoreForgeProject,
    serializeForgeProject,
  } = await courseModule("app/course/forge.ts");

  const files = createForgeProject(FORGE_ARTIFACTS.map((artifact) => artifact.questId));
  assert.equal(Object.keys(files).length, 48);
  assert.equal(FORGE_ARTIFACTS.length, 13);
  assert.equal(FORGE_CHECKPOINTS.length, 5);
  REQUIRED_FORGE_FILES.forEach((path) => assert.ok(files[path], `Forge exports ${path}`));
  assert.match(files["shell.qml"], /ShellRoot\s*\{/);
  assert.match(files["modules/bar/Bar.qml"], /PanelWindow\s*\{/);
  assert.match(files["README.md"], /Linux\/Wayland/);
  assert.doesNotMatch(Object.values(files).join("\n"), /__(?:PROJECT_NAME|SHELL_ID|AUTHOR)__/);

  const manifest = getForgeManifest(files);
  assert.equal(manifest.target.platform, "Linux/Wayland");
  assert.equal(manifest.target.quickshell, "0.3.x");
  assert.equal(manifest.appliedArtifactCodes.length, 13);
  assert.equal(manifest.reachedCheckpointIds.length, 5);

  const restored = restoreForgeProject(serializeForgeProject(files));
  assert.deepEqual(Object.keys(restored).sort(), Object.keys(files).sort());
  assert.equal(restored["shell.qml"], files["shell.qml"]);
});

test("keeps the interactive course UI, generated atlas art, and production metadata", async () => {
  const mapPaths = [
    "public/world-map.jpg",
    "public/map-system-atlas.jpg",
    "public/map-surface-realms.jpg",
    "public/map-expression-expanse.jpg",
    "public/map-production-citadel.jpg",
  ];
  const [page, css, layout, packageJson, hosting, readme, ...mapBuffers] = await Promise.all([
    readFile(new URL("app/page.tsx", rootUrl), "utf8"),
    readFile(new URL("app/globals.css", rootUrl), "utf8"),
    readFile(new URL("app/layout.tsx", rootUrl), "utf8"),
    readFile(new URL("package.json", rootUrl), "utf8"),
    readFile(new URL(".openai/hosting.json", rootUrl), "utf8"),
    readFile(new URL("README.md", rootUrl), "utf8"),
    ...mapPaths.map((path) => readFile(new URL(path, rootUrl))),
  ]);
  const mapStats = await Promise.all(mapPaths.map((path) => stat(new URL(path, rootUrl))));

  assert.match(page, /atlasQuestSeeds/);
  assert.match(page, /quizBank/);
  assert.match(page, /quizSetFor/);
  assert.match(page, /THREE SIGNALS/);
  assert.match(page, /smart indent · auto-pairs/);
  assert.match(page, /event\.key === "Enter"/);
  assert.match(page, /Shell Forge/);
  assert.match(page, /createForgeProject/);
  assert.match(page, /buildTar/);
  assert.match(page, /CODE DETECTIVE/);
  assert.match(page, /Quick quiz/);
  assert.match(page, /startQuickQuiz/);
  assert.match(page, /answerQuickQuiz/);
  assert.match(page, /REVIEW QUEUE/);
  assert.match(page, /quickQuizBest/);
  assert.match(page, /quick-quiz-arena\.jpg/);
  assert.match(page, /shell-forge-workshop\.jpg/);
  assert.match(page, /qml-build-lab\.jpg/);
  assert.match(page, /LessonMode/);
  assert.match(page, /qmlHighlight/);
  assert.match(page, /Run code checks/);
  assert.match(page, /localStorage\.setItem/);
  assert.match(page, /ScenePreview/);
  assert.match(page, /analyzeQml/);
  assert.match(page, /hasBlockingDiagnostics/);
  assert.match(page, /executionTier/);

  assert.match(css, /\.world-map/);
  assert.match(css, /\.campaign-selector/);
  assert.match(css, /\.illustrated-map/);
  assert.match(css, /\.region-drawer/);
  assert.match(css, /\.execution-ladder/);
  assert.match(css, /\.forge-panel/);
  assert.match(css, /\.quick-quiz-card/);
  assert.match(css, /\.mastery-modes/);
  assert.match(css, /\.diagnostic-stack/);
  assert.match(css, /\.editor-surface/);
  assert.match(css, /\.celebration/);
  assert.match(css, /prefers-reduced-motion/);

  mapBuffers.forEach((buffer, index) => {
    assert.deepEqual([...buffer.subarray(0, 3)], [0xff, 0xd8, 0xff], `${mapPaths[index]} is a JPEG`);
  });
  mapStats.forEach((info, index) => assert.ok(info.size > 100_000, `${mapPaths[index]} is substantive map art`));

  assert.match(readme, /QML Shellcraft/i);
  assert.match(readme, /Quickshell/);
  assert.match(readme, /Linux\/Wayland/);
  assert.match(readme, /browser simulation/i);
  assert.match(readme, /architecture/i);
  assert.match(layout, /QML Shellcraft — Zero to Shellwright/);
  assert.match(layout, /\/og\.jpg/);
  assert.match(packageJson, /"name": "qml-shellcraft"/);
  assert.match(hosting, /"project_id"/);
});
