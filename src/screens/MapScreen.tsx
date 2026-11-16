import { useNavigate } from 'react-router'
import { art } from '@/art'
import { AREAS } from '@/content/areas'
import { LEVEL_OUTLINE } from '@/content/levels'
import { isAreaUnlocked } from '@/game/progression'
import type { AreaId } from '@/game/types'
import { useSave } from '@/state/save'
import { Icon } from '@/ui/Icon'
import { Screen } from '@/ui/Screen'

/** Where each area's pin sits on the town picture, in percent. */
const PIN: Record<AreaId, { x: number; y: number }> = {
  school: { x: 24, y: 27 },
  dormitory: { x: 76, y: 24 },
  streets: { x: 50, y: 48 },
  'food-district': { x: 26, y: 68 },
  park: { x: 76, y: 76 },
}

/** World map: the town from above, with one pin per area. */
export function MapScreen() {
  const navigate = useNavigate()
  const records = useSave((s) => s.records)

  return (
    <Screen title="Bản đồ thị trấn" back="/lobby">
      <div className="relative mx-auto aspect-[3/4] max-h-full overflow-hidden rounded-3xl border-4 border-cotton shadow-[0_5px_0_var(--color-mist-deep)]">
        <img src={art('town')} alt="" className="absolute inset-0 size-full object-cover" />
        {AREAS.map((area, index) => {
          const unlocked = isAreaUnlocked(AREAS, LEVEL_OUTLINE, records, area.id)
          const levels = LEVEL_OUTLINE.filter((l) => l.areaId === area.id)
          const cleared = levels.filter((l) => records[l.id]?.cleared).length
          const { x, y } = PIN[area.id]
          return (
            <button
              key={area.id}
              type="button"
              disabled={!unlocked}
              title={unlocked ? undefined : `Hoàn thành ${AREAS[index - 1].name} để mở khoá`}
              onClick={() => navigate(`/area/${area.id}`)}
              style={{ left: `${x}%`, top: `${y}%` }}
              className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-2xl border-2 border-cotton px-3 py-1.5 text-center leading-tight transition-transform active:translate-y-[calc(-50%+2px)] ${unlocked ? 'bg-cotton text-ink shadow-[0_4px_0_var(--color-ink-soft)]' : 'bg-cotton/80 text-ink-soft backdrop-blur-sm'}`}
            >
              <span className="font-display text-base font-bold whitespace-nowrap">
                {index + 1}. {area.name}
              </span>
              {unlocked ? (
                <span className="text-sm font-bold text-blue-ink">
                  {cleared}/{levels.length}
                </span>
              ) : (
                <Icon name="lock" className="size-4" />
              )}
            </button>
          )
        })}
      </div>
      <p className="mt-3 text-center text-sm text-ink-soft">
        Hoàn thành mọi màn của một khu để mở khu tiếp theo.
      </p>
    </Screen>
  )
}
