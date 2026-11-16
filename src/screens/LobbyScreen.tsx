import { useState } from 'react'
import { useNavigate } from 'react-router'
import { art } from '@/art'
import { AREAS, GUIDE_NAME } from '@/content/areas'
import { LEVEL_OUTLINE, LEVELS } from '@/content/levels'
import { playerLevel } from '@/game/progression'
import type { AreaDef, AreaId } from '@/game/types'
import { useSave } from '@/state/save'
import { useUnlocks } from '@/state/unlocks'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { Guide } from '@/ui/Guide'
import { Icon } from '@/ui/Icon'
import { PlayerAvatar } from '@/ui/Player'
import { UnlockDialog } from '@/ui/UnlockDialog'

/** Where each area's marker sits on the town picture, in percent. */
const PLACE: Record<AreaId, { x: number; y: number }> = {
  school: { x: 25, y: 27 },
  dormitory: { x: 75, y: 25 },
  streets: { x: 50, y: 49 },
  'food-district': { x: 27, y: 68 },
  park: { x: 74, y: 75 },
}

/**
 * Home: the town map with one marker per area, under the player's header and
 * above the library button and the button that continues with the next level.
 */
export function LobbyScreen() {
  const navigate = useNavigate()
  const name = useSave((s) => s.profile?.name ?? '')
  const xp = useSave((s) => s.xp)
  const openByHand = useSave((s) => s.openByHand)
  const { records, areaOpen, nextId } = useUnlocks()
  const [asking, setAsking] = useState<AreaDef | null>(null)

  const { level, into, needed } = playerLevel(xp)
  const next = LEVEL_OUTLINE.find((l) => l.id === nextId && LEVELS[l.id])
  const nextArea = next && AREAS.find((a) => a.id === next.areaId)

  return (
    <div className="relative flex h-full flex-col gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <Card className="flex items-center gap-3 !p-3">
        <PlayerAvatar />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate font-display text-lg font-bold text-ink">{name}</p>
            <p className="shrink-0 text-sm font-bold text-blue-ink">Cấp {level}</p>
          </div>
          <div
            className="mt-1 h-3 overflow-hidden rounded-full bg-mist"
            role="progressbar"
            aria-label="Kinh nghiệm"
            aria-valuenow={into}
            aria-valuemin={0}
            aria-valuemax={needed}
          >
            <div
              className="h-full rounded-full bg-butter-edge"
              style={{ width: `${(into / needed) * 100}%` }}
            />
          </div>
        </div>
        <button
          type="button"
          aria-label="Cài đặt"
          onClick={() => navigate('/settings')}
          className="flex size-11 items-center justify-center rounded-2xl bg-mist text-blue-ink active:translate-y-0.5"
        >
          <Icon name="settings" />
        </button>
      </Card>

      {/*
        The frame is as wide as the screen and never taller than the 3:4 picture, so
        nothing is cut off at the sides. On a short phone it gets shorter and the
        picture loses some sky and foreground; the markers stay on their buildings.
      */}
      <div className="flex min-h-0 flex-1 items-center [container-type:size]">
        <div
          aria-label="Bản đồ thị trấn"
          role="group"
          className="relative h-[min(100cqh,133.33cqw)] w-full overflow-hidden rounded-3xl border-4 border-cotton shadow-[0_5px_0_var(--color-mist-deep)]"
        >
          <div className="absolute top-1/2 left-0 aspect-[3/4] w-full -translate-y-1/2">
            <img
              src={art('town')}
              alt=""
              draggable={false}
              className="absolute inset-0 size-full select-none"
            />
            {AREAS.map((area, index) => {
              const open = areaOpen(area.id)
              const levels = LEVEL_OUTLINE.filter((l) => l.areaId === area.id)
              const cleared = levels.filter((l) => records[l.id]?.cleared).length
              const isNext = nextArea?.id === area.id
              const { x, y } = PLACE[area.id]
              return (
                <button
                  key={area.id}
                  type="button"
                  aria-label={`${area.name}, ${open ? `đã qua ${cleared} trên ${levels.length} màn` : 'đang khoá'}`}
                  onClick={() => (open ? navigate(`/area/${area.id}`) : setAsking(area))}
                  style={{ left: `${x}%`, top: `${y}%` }}
                  className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-2xl border-2 py-1.5 pr-3 pl-1.5 text-left leading-tight active:scale-95 ${
                    !open
                      ? 'border-cotton/70 bg-cotton/75 text-ink-soft backdrop-blur-sm'
                      : isNext
                        ? 'border-cotton bg-butter text-ink shadow-[0_4px_0_var(--color-butter-edge)]'
                        : 'border-cotton bg-cotton text-ink shadow-[0_4px_0_var(--color-ink-soft)]'
                  }`}
                >
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-xl font-display text-base font-bold ${open ? (isNext ? 'bg-cotton' : 'bg-mist') : 'bg-mist/70'}`}
                  >
                    {open ? index + 1 : <Icon name="lock" className="size-4" />}
                  </span>
                  <span>
                    <span className="block font-display text-base font-bold whitespace-nowrap">
                      {area.name}
                    </span>
                    <span className="block text-xs font-bold whitespace-nowrap text-blue-ink">
                      {open ? `${cleared}/${levels.length} màn` : 'Đang khoá'}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Only where the screen is tall enough to spare the room. */}
      {next && nextArea && (
        <Card className="hidden items-center gap-3 !p-3 [@media(min-height:760px)]:flex">
          <Guide mood="happy" className="size-14 shrink-0" />
          <p className="min-w-0 flex-1 leading-snug">
            <span className="block font-display text-sm font-bold text-blue-ink">{GUIDE_NAME}</span>
            Chào {name}! Hôm nay mình ghé {nextArea.name} nhé.
          </p>
        </Card>
      )}

      {/* One row, so that the map keeps as much height as possible on short phones. */}
      <div className="flex items-stretch gap-3">
        <button
          type="button"
          onClick={() => navigate('/library')}
          className="flex w-20 shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl border-2 border-mist-edge bg-cotton py-2 font-display text-sm leading-tight font-bold text-ink shadow-[0_5px_0_var(--color-mist-edge)] transition-transform active:translate-y-[5px] active:shadow-none"
        >
          <Icon name="book" />
          Thư viện
        </button>
        {next && nextArea ? (
          <Button
            variant="loud"
            icon="play"
            aria-label={`Chơi: ${next.title}`}
            className="min-w-0 flex-1 !justify-start !gap-3 !px-4 text-left"
            onClick={() => navigate(`/level/${next.id}`)}
          >
            <span className="min-w-0">
              <span className="block text-2xl">Chơi</span>
              <span className="block truncate font-sans text-sm font-bold">
                {nextArea.name} · {next.title}
              </span>
            </span>
          </Button>
        ) : (
          <Card className="flex min-w-0 flex-1 items-center gap-2 !p-2 leading-tight">
            <Guide mood="cheer" className="size-12 shrink-0" />
            <p>
              <span className="block font-display font-bold text-ink">Bạn đã qua mọi màn!</span>
              <span className="block text-sm text-ink-soft">Chạm vào một khu để chơi lại.</span>
            </p>
          </Card>
        )}
      </div>

      {asking && (
        <UnlockDialog
          name={asking.name}
          rule={`Khu này mở khi bạn qua hết các màn ở ${AREAS[AREAS.indexOf(asking) - 1].name}.`}
          onClose={() => setAsking(null)}
          onUnlock={() => {
            openByHand(asking.id)
            navigate(`/area/${asking.id}`)
          }}
        />
      )}
    </div>
  )
}
