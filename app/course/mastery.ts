export type MasteryRecord = {
  attempts: number;
  correct: number;
  streak: number;
  lastSeen: number;
  nextReview: number;
  confidence: number;
  hintUses: number;
  solutionUses: number;
};

export type MasteryState = Record<string, MasteryRecord>;

export type ReviewMode = "journey" | "weak" | "due" | "campaign" | "boss" | "all";

export type ReviewCandidate = {
  id: string;
  campaign: number;
  boss?: boolean;
  prerequisites?: string[];
  conceptIds?: string[];
};

const reviewIntervals = [4 * 60 * 60 * 1000, 2 * 24 * 60 * 60 * 1000, 7 * 24 * 60 * 60 * 1000, 21 * 24 * 60 * 60 * 1000];

export function emptyMasteryRecord(): MasteryRecord {
  return { attempts: 0, correct: 0, streak: 0, lastSeen: 0, nextReview: 0, confidence: 0, hintUses: 0, solutionUses: 0 };
}

export function recordAnswer(state: MasteryState, conceptId: string, isCorrect: boolean, now = Date.now()): MasteryState {
  const current = state[conceptId] ?? emptyMasteryRecord();
  const streak = isCorrect ? current.streak + 1 : 0;
  const intervalIndex = isCorrect ? Math.min(Math.max(0, streak - 1), reviewIntervals.length - 1) : 0;
  const confidenceDelta = isCorrect ? 0.2 : -0.3;
  return {
    ...state,
    [conceptId]: {
      ...current,
      attempts: current.attempts + 1,
      correct: current.correct + (isCorrect ? 1 : 0),
      streak,
      lastSeen: now,
      nextReview: now + reviewIntervals[intervalIndex],
      confidence: Math.max(0, Math.min(1, current.confidence + confidenceDelta)),
    },
  };
}

export function recordSupportUse(state: MasteryState, conceptId: string, kind: "hint" | "solution"): MasteryState {
  const current = state[conceptId] ?? emptyMasteryRecord();
  return {
    ...state,
    [conceptId]: {
      ...current,
      hintUses: current.hintUses + (kind === "hint" ? 1 : 0),
      solutionUses: current.solutionUses + (kind === "solution" ? 1 : 0),
      confidence: Math.max(0, current.confidence - (kind === "solution" ? 0.18 : 0.06)),
    },
  };
}

export function masteryPercent(record?: MasteryRecord): number {
  if (!record?.attempts) return 0;
  const accuracy = record.correct / record.attempts;
  const retrieval = Math.min(1, record.streak / 3);
  return Math.round((accuracy * 0.65 + retrieval * 0.2 + record.confidence * 0.15) * 100);
}

export function selectReviewCandidates(
  candidates: ReviewCandidate[],
  state: MasteryState,
  mode: ReviewMode,
  options: { completed: Set<string>; activeCampaign: number; now?: number },
): ReviewCandidate[] {
  const now = options.now ?? Date.now();
  const scored = candidates.map(candidate => {
    const conceptIds = candidate.conceptIds?.length ? candidate.conceptIds : [candidate.id];
    const records = conceptIds.map(id => state[id]).filter((record): record is MasteryRecord => Boolean(record));
    const attempted = records.filter(record => record.attempts > 0);
    return {
      candidate,
      records,
      attempted,
      score: attempted.length ? Math.round(attempted.reduce((sum, record) => sum + masteryPercent(record), 0) / attempted.length) : 0,
      lastSeen: attempted.length ? Math.min(...attempted.map(record => record.lastSeen)) : 0,
      nextReview: attempted.length ? Math.min(...attempted.map(record => record.nextReview)) : Number.POSITIVE_INFINITY,
    };
  });

  if (mode === "weak") {
    return scored.filter(item => item.attempted.length > 0).sort((a, b) => a.score - b.score || a.lastSeen - b.lastSeen).map(item => item.candidate);
  }

  if (mode === "due") {
    return scored.filter(item => item.attempted.some(record => record.nextReview <= now)).sort((a, b) => a.nextReview - b.nextReview).map(item => item.candidate);
  }

  if (mode === "campaign") return candidates.filter(candidate => candidate.campaign === options.activeCampaign);
  if (mode === "boss") return candidates.filter(candidate => candidate.boss);
  if (mode === "journey") {
    const completedAndNear = candidates.filter(candidate => options.completed.has(candidate.id));
    const frontier = candidates.find(candidate => !options.completed.has(candidate.id));
    return frontier && !completedAndNear.some(candidate => candidate.id === frontier.id) ? [...completedAndNear, frontier] : completedAndNear;
  }

  return candidates;
}

export function normalizeMastery(value: unknown): MasteryState {
  if (!value || typeof value !== "object") return {};
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).flatMap(([id, raw]) => {
    if (!raw || typeof raw !== "object") return [];
    const record = raw as Partial<MasteryRecord>;
    const safe: MasteryRecord = {
      attempts: Math.max(0, Number(record.attempts) || 0),
      correct: Math.max(0, Number(record.correct) || 0),
      streak: Math.max(0, Number(record.streak) || 0),
      lastSeen: Math.max(0, Number(record.lastSeen) || 0),
      nextReview: Math.max(0, Number(record.nextReview) || 0),
      confidence: Math.max(0, Math.min(1, Number(record.confidence) || 0)),
      hintUses: Math.max(0, Number(record.hintUses) || 0),
      solutionUses: Math.max(0, Number(record.solutionUses) || 0),
    };
    return [[id, safe]];
  }));
}
