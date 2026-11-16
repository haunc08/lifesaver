import { AREAS } from '@/content/areas'
import { LEVEL_OUTLINE } from '@/content/levels'
import { isAreaUnlocked, isLevelUnlocked, nextLevelId } from '@/game/progression'
import type { AreaId } from '@/game/types'
import { useSave } from './save'

/** The unlock rules applied to the saved game, including what was opened by hand. */
export function useUnlocks() {
  const records = useSave((s) => s.records)
  const opened = useSave((s) => s.opened)
  return {
    records,
    areaOpen: (id: AreaId) => isAreaUnlocked(AREAS, LEVEL_OUTLINE, records, id, opened),
    levelOpen: (id: string) => isLevelUnlocked(AREAS, LEVEL_OUTLINE, records, id, opened),
    nextId: nextLevelId(AREAS, LEVEL_OUTLINE, records, opened),
  }
}
