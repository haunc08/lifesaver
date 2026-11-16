/** Content schema: everything a level, area or lesson is made of. Pure data, no logic. */

export type AreaId = 'school' | 'dormitory' | 'streets' | 'food-district' | 'park'

export interface AreaDef {
  id: AreaId
  name: string
  tagline: string
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

/** Find every hazard among labelled spots; tapping a harmless spot costs accuracy. */
export interface ScanConfig {
  type: 'scan'
  instruction: string
  spots: {
    id: string
    label: string
    x: number
    y: number
    hazard: boolean
    /** Shown when the spot is tapped: why it is, or is not, a danger. */
    note: string
  }[]
}

/** Press and hold without letting go, e.g. steady pressure on a wound. */
export interface HoldConfig {
  type: 'hold'
  instruction: string
  /** Label on the hold button, e.g. "Ép chặt miếng gạc". */
  action: string
  /** Gameplay seconds to hold (3–8). Not a real medical duration. */
  holdSec: number
  /** Shown while the player is holding. */
  holdingText: string
  /** Shown when the player lets go early. */
  releaseText: string
  /** What the real duration or rule is, so the short hold teaches nothing wrong. */
  realityNote: string
}

/** Move each item to the zone where it belongs; decoy items stay in the tray. */
export interface DragPlaceConfig {
  type: 'drag-place'
  instruction: string
  zones: { id: string; label: string; x: number; y: number }[]
  items: {
    id: string
    label: string
    /** Zone this item belongs in; null for a decoy that must not be used. */
    zoneId: string | null
    /** Shown when the item is dropped in the wrong place, or a decoy is used. */
    wrongNote: string
  }[]
}

/** A run of short cards, each answered with one of two buttons before its timer ends. */
export interface QuickDecisionConfig {
  type: 'quick-decision'
  instruction: string
  /** The two answer buttons, e.g. ['Nên làm', 'Không nên']. */
  answers: [string, string]
  /** Seconds allowed per card (6–10). */
  secPerCard: number
  cards: {
    id: string
    text: string
    /** Index into `answers`. */
    answer: 0 | 1
    /** Shown after the card is answered, right or wrong. */
    why: string
  }[]
}

export type SingleMinigameConfig =
  TapTargetsConfig | ScanConfig | HoldConfig | DragPlaceConfig | QuickDecisionConfig

/** Two or three mechanics played one after another. */
export interface SequenceConfig {
  type: 'sequence'
  steps: SingleMinigameConfig[]
}

/** Union of all mini-game configs; add a member per new mechanic. */
export type MinigameConfig = SingleMinigameConfig | SequenceConfig

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
