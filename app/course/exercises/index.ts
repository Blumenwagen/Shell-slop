/**
 * Per-quest authored exercise overrides, keyed by quest id.
 *
 * Recipes in atlas.ts provide generic fallback exercises; every quest listed
 * here instead ships an exercise authored for ITS OWN lesson — its starter
 * sets up the specific problem the quest teaches, its solution demonstrates
 * the taught pattern, and its checks verify exactly that pattern. Overrides
 * may also replace the templated rules and glued explanation paragraphs.
 *
 * Authoring contract: docs/EXERCISE_AUTHORING_SPEC.md.
 * Validation: node --experimental-strip-types scripts/verify-atlas.mjs
 */
import type { AtlasExercise } from "./types.ts";
import { CAMPAIGN1_EXERCISES } from "./campaign1.ts";
import { CAMPAIGN2_EXERCISES } from "./campaign2.ts";
import { CAMPAIGN3_EXERCISES } from "./campaign3.ts";
import { CAMPAIGN4_EXERCISES } from "./campaign4.ts";
import { CAMPAIGN5_EXERCISES } from "./campaign5.ts";

export type { AtlasExercise } from "./types.ts";

export const ATLAS_EXERCISES: Record<string, AtlasExercise> = {
  ...CAMPAIGN1_EXERCISES,
  ...CAMPAIGN2_EXERCISES,
  ...CAMPAIGN3_EXERCISES,
  ...CAMPAIGN4_EXERCISES,
  ...CAMPAIGN5_EXERCISES,
};
