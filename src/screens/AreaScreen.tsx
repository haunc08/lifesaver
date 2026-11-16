import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { art } from '@/art'
import { AREAS } from '@/content/areas'
import { LEVEL_OUTLINE, LEVELS } from '@/content/levels'
import type { LevelOutline } from '@/game/types'
import { useSave } from '@/state/save'
import { useUnlocks } from '@/state/unlocks'
import { Card } from '@/ui/Card'
import { Icon } from '@/ui/Icon'
import { Screen } from '@/ui/Screen'
import { Stars } from '@/ui/Stars'
import { Sticker } from '@/ui/Sticker'
import { UnlockDialog } from '@/ui/UnlockDialog'

/** Level select within one area. */
export function AreaScreen() {
  const navigate = useNavigate()
  const { areaId } = useParams()
  const openByHand = useSave((s) => s.openByHand)
  const { records, areaOpen, levelOpen } = useUnlocks()
  const [asking, setAsking] = useState<LevelOutline | null>(null)
  const area = AREAS.find((a) => a.id === areaId)

  if (!area || !areaOpen(area.id)) return <Navigate to="/lobby" replace />

  const levels = LEVEL_OUTLINE.filter((l) => l.areaId === area.id)

  return (
    <Screen title={area.name} back="/lobby" className="space-y-3">
      <img
        src={art(`area-${area.id}`)}
        alt=""
        className="aspect-[2/1] w-full rounded-3xl border-4 border-cotton object-cover shadow-[0_5px_0_var(--color-mist-deep)]"
      />
      {levels.map((level, index) => {
        const built = Boolean(LEVELS[level.id])
        const open = levelOpen(level.id)
        const record = records[level.id]
        const status = !built ? 'Sắp ra mắt' : !open ? 'Đang khoá' : level.theme
        return (
          <button
            key={level.id}
            type="button"
            disabled={!built}
            onClick={() => (open ? navigate(`/level/${level.id}`) : setAsking(level))}
            className="block w-full text-left transition-transform active:translate-y-0.5 disabled:opacity-60"
          >
            <Card className={`flex items-center gap-3 ${built && !open ? 'bg-cotton/60' : ''}`}>
              <Sticker className="!size-14">
                {!built ? (
                  <Icon name="soon" />
                ) : !open ? (
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
              {built && open && <Stars count={record?.stars ?? 0} className="text-xl" />}
            </Card>
          </button>
        )
      })}

      {asking && (
        <UnlockDialog
          name={asking.title}
          rule="Màn này mở khi bạn qua màn trước nó."
          onClose={() => setAsking(null)}
          onUnlock={() => {
            openByHand(asking.id)
            setAsking(null)
          }}
        />
      )}
    </Screen>
  )
}
