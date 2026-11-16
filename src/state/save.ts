import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { applyResult, type Records, type Reward } from '@/game/progression'
import type { ScoreResult } from '@/game/scoring'

/**
 * The saved game: everything that must survive a reload. Persisted to
 * localStorage; bump SAVE_VERSION and add a migration when the shape changes.
 */

const SAVE_KEY = 'lifesaver-save'
const SAVE_VERSION = 1

export interface Settings {
  music: boolean
  sfx: boolean
}

interface SaveData {
  /** null until the player has created their character. */
  profile: { name: string } | null
  introSeen: boolean
  xp: number
  records: Records
  /** Ids of lessons added to the library by playing, oldest first. */
  lessons: string[]
  settings: Settings
}

interface SaveActions {
  markIntroSeen: () => void
  createProfile: (name: string) => void
  /** Store a finished run and return the reward it earned. */
  recordResult: (levelId: string, lessonId: string, result: ScoreResult) => Reward
  setSetting: (key: keyof Settings, value: boolean) => void
  resetAll: () => void
}

const EMPTY: SaveData = {
  profile: null,
  introSeen: false,
  xp: 0,
  records: {},
  lessons: [],
  settings: { music: true, sfx: true },
}

export const useSave = create<SaveData & SaveActions>()(
  persist(
    (set, get) => ({
      ...EMPTY,
      markIntroSeen: () => set({ introSeen: true }),
      createProfile: (name) => set({ profile: { name } }),
      recordResult: (levelId, lessonId, result) => {
        const { records, xp, lessons } = get()
        const { record, reward } = applyResult(records[levelId], result)
        set({
          records: { ...records, [levelId]: record },
          xp: xp + reward.xp,
          lessons: lessons.includes(lessonId) ? lessons : [...lessons, lessonId],
        })
        return reward
      },
      setSetting: (key, value) => set((s) => ({ settings: { ...s.settings, [key]: value } })),
      resetAll: () => set(EMPTY),
    }),
    { name: SAVE_KEY, version: SAVE_VERSION },
  ),
)
