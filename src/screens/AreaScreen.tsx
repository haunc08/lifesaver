import { Navigate, useNavigate, useParams } from 'react-router'
import { AREAS } from '@/content/areas'
import { LEVEL_OUTLINE, LEVELS } from '@/content/levels'
import { isAreaUnlocked, isLevelUnlocked } from '@/game/progression'
import { useSave } from '@/state/save'
import { Card } from '@/ui/Card'
import { Screen } from '@/ui/Screen'
import { Stars } from '@/ui/Stars'
import { Icon } from '@/ui/Icon'
import { Sticker } from '@/ui/Sticker'
import { art } from '@/art'

/** Level select within one area. */
export function AreaScreen() {
  const navigate = useNavigate()
  const { areaId } = useParams()
  const records = useSave((s) => s.records)
  const area = AREAS.find((a) => a.id === areaId)

  if (!area || !isAreaUnlocked(AREAS, LEVEL_OUTLINE, records, area.id)) {
    return <Navigate to="/map" replace />
  }

  const levels = LEVEL_OUTLINE.filter((l) => l.areaId === area.id)

  return (
    <Screen title={area.name} back="/map" className="space-y-3">
      <img
        src={art(`area-${area.id}`)}
        alt=""
        className="aspect-[2/1] w-full rounded-3xl border-4 border-cotton object-cover shadow-[0_5px_0_var(--color-mist-deep)]"
      />
      {levels.map((level, index) => {
        const built = Boolean(LEVELS[level.id])
        const unlocked = isLevelUnlocked(AREAS, LEVEL_OUTLINE, records, level.id)
        const record = records[level.id]
        const status = !built
          ? 'Sắp ra mắt'
          : !unlocked
            ? 'Hoàn thành màn trước để mở khoá'
            : level.theme
        return (
          <button
            key={level.id}
            type="button"
            disabled={!built || !unlocked}
            onClick={() => navigate(`/level/${level.id}`)}
            className="block w-full text-left transition-transform active:translate-y-0.5 disabled:opacity-60"
          >
            <Card className="flex items-center gap-3">
              <Sticker className="!size-14">
                {!built ? (
                  <Icon name="soon" />
                ) : !unlocked ? (
                  <Icon name="lock" />
                ) : art(level.id) ? (
                  <img src={art(level.id)} alt="" className="size-full object-cover" />
                ) : (
                  index + 1
                )}
              </Sticker>
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-bold text-ink">{level.title}</p>
                <p className="truncate text-sm text-ink-soft">{status}</p>
              </div>
              {built && unlocked && <Stars count={record?.stars ?? 0} className="text-xl" />}
            </Card>
          </button>
        )
      })}
    </Screen>
  )
}
