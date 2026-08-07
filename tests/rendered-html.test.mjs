import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the QML Shellcraft world map", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /QML SHELLCRAFT/);
  assert.match(html, /zero → hero adventure/);
  assert.match(html, /26(?:<!-- -->)? quests/);
  assert.match(html, /Six worlds\. One living shell\./);
  assert.match(html, /world-map\.png/);
  assert.match(html, /Tell QML what exists/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("keeps the complete interactive curriculum and finished metadata", async () => {
  const [page, css, layout, packageJson, hosting] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
  ]);

  assert.equal((page.match(/^    id: "/gm) ?? []).length, 26);
  assert.equal((page.match(/name: "(?:First Sparks|Shape District|Motion Arcade|System Frontier|Living Shell|Hero Forge)"/g) ?? []).length, 6);
  assert.match(page, /quizAnswers/);
  assert.match(page, /quizSetFor/);
  assert.match(page, /THREE SIGNALS/);
  assert.match(page, /smart indent · auto-pairs/);
  assert.match(page, /event\.key === "Enter"/);
  assert.match(page, /Run code checks/);
  assert.match(page, /localStorage\.setItem/);
  assert.match(page, /ScenePreview/);
  assert.match(css, /\.world-map/);
  assert.match(css, /\.illustrated-map/);
  assert.match(css, /\.region-drawer/);
  assert.match(css, /\.celebration/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(layout, /QML Shellcraft — Zero to Shellwright/);
  assert.match(layout, /\/og\.png/);
  assert.match(packageJson, /"name": "qml-shellcraft"/);
  assert.match(hosting, /"project_id"/);
});
