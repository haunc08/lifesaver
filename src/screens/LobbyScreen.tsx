import { useNavigate } from 'react-router'
import { AREAS } from '@/content/areas'
import { LEVEL_OUTLINE, LEVELS } from '@/content/levels'
import { nextLevelId, playerLevel } from '@/game/progression'
import { useSave } from '@/state/save'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { Guide } from '@/ui/Guide'
import { Icon } from '@/ui/Icon'
import { Player } from '@/ui/Player'
import { Sticker } from '@/ui/Sticker'
import { art } from '@/art'

/** The hub: player header, character, play button and the way into everything else. */
export function LobbyScreen() {
  const navigate = useNavigate()
  const name = useSave((s) => s.profile?.name ?? '')
  const xp = useSave((s) => s.xp)
  const records = useSave((s) => s.records)

  const { level, into, needed } = playerLevel(xp)
  const nextId = nextLevelId(AREAS, LEVEL_OUTLINE, records)
  const next = LEVEL_OUTLINE.find((l) => l.id === nextId)
  const nextPlayable = next && LEVELS[next.id] ? next : undefined

  return (
    <div className="flex h-full flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))]">
      <Card className="flex items-center gap-3 !p-3">
        <Sticker>
          <Player className="mt-7 w-16 max-w-none" />
        </Sticker>
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
          className="flex size-11 items-center justify-center rounded-2xl bg-mist text-xl active:translate-y-0.5"
        >
          <Icon name="settings" />
        </button>
      </Card>

      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="relative aspect-square w-full max-w-72 overflow-hidden rounded-[2.5rem] border-4 border-cotton shadow-[0_5px_0_var(--color-mist-deep)]">
          <img src={art('town')} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-1">
            <Player className="h-52" />
            <Guide mood="happy" className="mb-3 h-24" />
          </div>
        </div>
        <p className="min-h-6 text-center text-ink-soft">
          {nextPlayable
            ? `Tiếp theo: ${nextPlayable.title}`
            : next
              ? 'Màn tiếp theo sắp ra mắt'
              : 'Bạn đã hoàn thành mọi màn hiện có!'}
        </p>
        <Button
          size="lg"
          variant="loud"
          className="w-56"
          onClick={() => navigate(nextPlayable ? `/level/${nextPlayable.id}` : '/map')}
        >
          Chơi
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="plain"
          className="flex items-center justify-center gap-2"
          onClick={() => navigate('/map')}
        >
          <Icon name="map" /> Bản đồ
        </Button>
        <Button
          variant="plain"
          className="flex items-center justify-center gap-2"
          onClick={() => navigate('/library')}
        >
          <Icon name="book" /> Thư viện
        </Button>
      </div>
    </div>
  )
}
