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
  /**
   * Needed to judge the situation. The observe phase can end once every
   * essential clue has been inspected; the others are optional extras.
   */
  essential: boolean
}

export interface AssessOption {
  id: string
  text: string
  correct: boolean
  /** Shown when the player picks this option. */
  feedback: string
}

export type SolutionKind = 'correct' | 'unsafe' | 'irrelevant'

export interface SolutionOption {
  id: string
  text: string
  kind: SolutionKind
  /** Why this option is right, unsafe or beside the point. */
  feedback: string
  /** Correct options only: the level cannot be passed without this step. */
  mandatory?: boolean
}

/** Do every task among the marked spots; at least one spot is a thing not to do. */
export interface TapTargetsConfig {
  type: 'tap-targets'
  instruction: string
  targets: { id: string; label: string; x: number; y: number }[]
  /** Things that look like tasks but must be left alone; tapping one costs accuracy. */
  decoys: {
    id: string
    label: string
    x: number
    y: number
    /** Shown when the decoy is tapped: why not to do it. */
    note: string
  }[]
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
  /** The thing being held: art id of its picture, and where on the scene it is applied (percent). */
  tool: { art: string; x: number; y: number }
}

/** Move each item to the zone where it belongs; decoy items stay in the tray. */
export interface DragPlaceConfig {
  type: 'drag-place'
  instruction: string
  zones: { id: string; label: string; x: number; y: number }[]
  items: {
    id: string
    label: string
    /** Art id of the item's picture, e.g. "item-gauze". */
    art: string
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

/** A point on a scene, in percent of its width and height. */
export interface ScenePoint {
  x: number
  y: number
}

/**
 * Move a tool along a marked path without leaving it, e.g. wrap a bandage round
 * an arm, or scrape a stinger off sideways with the edge of a card.
 */
export interface TraceConfig {
  type: 'trace'
  instruction: string
  /** Art id of the close-up this is played on; the level's scene when left out. */
  art?: string
  /** The thing moved along the path; `size` is its width in percent of the picture (default 16). */
  tool: { art: string; label: string; size?: number }
  /** The path from start to end, at least two points. */
  path: ScenePoint[]
  /** 'band': the part already covered is drawn as a bandage. 'none': only the tool moves. */
  trail: 'band' | 'none'
  /** A small thing lying on the path that the tool takes away as it passes, e.g. a stinger. */
  speck?: ScenePoint
  /** True when the movement must be slow: going too fast counts as a slip. */
  gentle?: boolean
  /** Shown when the tool leaves the path (or, for a gentle path, goes too fast). */
  slipNote: string
  /** Shown when the end is reached. */
  doneNote: string
  /** What this stands for in real life, so the short gesture teaches nothing wrong. */
  realityNote: string
}

/** Rub a tool back and forth over each marked place until it is done, e.g. a cool wet towel. */
export interface RubConfig {
  type: 'rub'
  instruction: string
  /** Art id of the close-up this is played on; the level's scene when left out. */
  art?: string
  tool: { art: string; label: string }
  spots: { id: string; label: string; x: number; y: number }[]
  /** Shown when every place is done. */
  doneNote: string
  realityNote: string
}

/** Turn a dial the right way round, e.g. close a gas valve. Turning the wrong way is a slip. */
export interface RotateConfig {
  type: 'rotate'
  instruction: string
  /** The thing that is turned: art id of its picture seen from the front, and its name. */
  dial: { art: string; label: string }
  /** Where the thing is on the scene. */
  x: number
  y: number
  /** 'cw' is clockwise. */
  direction: 'cw' | 'ccw'
  /** Full turns needed (1–3). */
  turns: number
  /** Shown when the dial is turned the wrong way. */
  wrongWayNote: string
  /** Shown when the dial is fully turned. */
  doneNote: string
  realityNote: string
}

/** Dial an emergency number, then answer the dispatcher's questions one by one. */
export interface CallConfig {
  type: 'call'
  instruction: string
  /** The number to dial; the instruction names the service, not the number. */
  number: '113' | '114' | '115'
  /** Who answers, e.g. "Tổng đài 115". */
  callee: string
  /** The dispatcher's questions, in order; each has exactly one good reply. */
  turns: {
    id: string
    ask: string
    replies: {
      id: string
      text: string
      right: boolean
      /** Why this reply helps, or does not. */
      why: string
    }[]
  }[]
  /** The dispatcher's last line, shown when the call is done. */
  closing: string
}

export type SingleMinigameConfig =
  | TapTargetsConfig
  | ScanConfig
  | HoldConfig
  | DragPlaceConfig
  | QuickDecisionConfig
  | TraceConfig
  | RubConfig
  | RotateConfig
  | CallConfig

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
  intro: DialogueLine[]
  observe: {
    /** At least two are essential; see Clue.essential. */
    clues: Clue[]
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
