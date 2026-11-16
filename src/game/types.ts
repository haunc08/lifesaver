/** Content schema: everything a level, area or lesson is made of. Pure data, no logic. */

export type AreaId = 'school' | 'dormitory' | 'streets' | 'food-district' | 'park'

export interface AreaDef {
  id: AreaId
  name: string
  tagline: string
  /** Placeholder art until the area illustration exists. */
  emoji: string
}

/** The six phases of a level, in play order. */
export const PHASES = ['intro', 'observe', 'assess', 'choose', 'act', 'outcome'] as const
export type PhaseId = (typeof PHASES)[number]

export type Mood = 'neutral' | 'happy' | 'worried' | 'pain' | 'surprised' | 'relieved'

export interface DialogueLine {
  /** Display name of the speaker; omit for narration. */
  speaker?: string
  text: string
  mood?: Mood
}

export interface Clue {
  id: string
  /** Short name shown on the hotspot. */
  label: string
  /** What the player learns when they inspect it. */
  caption: string
  /** Hotspot position inside the scene, in percent. */
  x: number
  y: number
}

export interface AssessOption {
  id: string
  text: string
  correct: boolean
  /** Shown when the player picks this option. */
  feedback: string
}

export type SolutionKind = 'correct' | 'partial' | 'unsafe' | 'irrelevant'

export interface SolutionOption {
  id: string
  text: string
  kind: SolutionKind
  /** Why this option is right, weaker, unsafe or beside the point. */
  feedback: string
  /** Correct options only: the level cannot be passed without this step. */
  mandatory?: boolean
  /** Partial options only: id of the correct step this is a weaker version of. */
  substitutes?: string
}

export interface TapTargetsConfig {
  type: 'tap-targets'
  instruction: string
  targets: { id: string; label: string; x: number; y: number }[]
}

/** Union of all mini-game configs; add a member per new mechanic. */
export type MinigameConfig = TapTargetsConfig

export type Outcome =
  'success' | 'partial-success' | 'recoverable-mistake' | 'unsafe-failure' | 'timeout'

export interface LessonDef {
  id: string
  title: string
  /** null for core safety lessons that are open from the start. */
  levelId: string | null
  areaId: AreaId | null
  signs: string[]
  principles: string[]
  donts: string[]
  callForHelp: string[]
  /** All three stay null until a qualified reviewer signs the lesson off. */
  source: string | null
  reviewer: string | null
  reviewedOn: string | null
}

export interface LevelDef {
  id: string
  areaId: AreaId
  title: string
  /** Label for the placeholder scene, e.g. "Lớp học". */
  scene: string
  /** Gameplay clock for the timed phases. Not a real medical time limit. */
  timeLimitSec: number
  intro: DialogueLine[]
  observe: {
    clues: Clue[]
    /** How many clues must be inspected before moving on. */
    required: number
  }
  assess: {
    question: string
    options: AssessOption[]
  }
  choose: {
    prompt: string
    options: SolutionOption[]
    /** Ids of the correct options in the order they should be done. */
    order: string[]
  }
  act: MinigameConfig
  /** Consequence text shown for each end state. */
  outcomes: Record<Outcome, string>
  /** One hint per phase: the hint button must work everywhere. */
  hints: Record<PhaseId, string>
  lesson: LessonDef
}

/** Planned level: lets the map show levels that are not built yet. */
export interface LevelOutline {
  id: string
  areaId: AreaId
  title: string
  theme: string
}
