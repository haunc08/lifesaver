import { useNavigate } from 'react-router'
import { AREAS } from '@/content/areas'
import { LEVEL_OUTLINE } from '@/content/levels'
import { isAreaUnlocked } from '@/game/progression'
import { useSave } from '@/state/save'
import { Card } from '@/ui/Card'
import { Screen } from '@/ui/Screen'
import { Sticker } from '@/ui/Sticker'

/** World map. Placeholder list; the final map is an illustrated high-angle view. */
export function MapScreen() {
  const navigate = useNavigate()
  const records = useSave((s) => s.records)

  return (
    <Screen title="Bản đồ thị trấn" back="/lobby" className="space-y-3">
      {AREAS.map((area, index) => {
        const unlocked = isAreaUnlocked(AREAS, LEVEL_OUTLINE, records, area.id)
        const levels = LEVEL_OUTLINE.filter((l) => l.areaId === area.id)
        const cleared = levels.filter((l) => records[l.id]?.cleared).length
        return (
          <button
            key={area.id}
            type="button"
            disabled={!unlocked}
            onClick={() => navigate(`/area/${area.id}`)}
            className="block w-full text-left transition-transform active:translate-y-0.5 disabled:opacity-60"
          >
            <Card className="flex items-center gap-3">
              <Sticker glyph={unlocked ? area.emoji : '🔒'} />
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-bold text-ink">
                  {index + 1}. {area.name}
                </p>
                <p className="truncate text-sm text-ink-soft">
                  {unlocked ? area.tagline : `Hoàn thành ${AREAS[index - 1].name} để mở khoá`}
                </p>
              </div>
              {unlocked && (
                <p className="shrink-0 text-sm font-bold text-blue-ink">
                  {cleared}/{levels.length}
                </p>
              )}
            </Card>
          </button>
        )
      })}
    </Screen>
  )
}
