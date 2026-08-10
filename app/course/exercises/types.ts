/** Serialized regex check — mirrors StructuralCheckSpec in atlas.ts (kept here to avoid an import cycle). */
export type ExerciseCheck = {
  label: string;
  hint: string;
  /** RegExp source string (double-escape backslashes in TS literals). Runs against comment-stripped code. */
  pattern: string;
  flags?: string;
};

export type AtlasExercise = {
  /** Complete QML starter file setting up this quest's specific problem. Must NOT already pass all checks. */
  starter: string;
  /** Complete, idiomatic QML solution. Must parse clean and pass all three checks. */
  solution: string;
  checks: [ExerciseCheck, ExerciseCheck, ExerciseCheck];
  /** Quest-specific rules; replaces the templated rules of expandRegion quests. */
  rules?: [string, string, string];
  /** Fully-authored explanation paragraphs; replaces the boilerplate-glued assembly. */
  explanation?: [string, string, string];
};
