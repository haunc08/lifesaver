import { useState } from 'react'
import { useNavigate } from 'react-router'
import { art } from '@/art'
import { GUIDE_NAME } from '@/content/areas'
import { useSave } from '@/state/save'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { Guide, type GuideMood } from '@/ui/Guide'
import { Player } from '@/ui/Player'

const SLIDES: { text: string; mood: GuideMood; withPlayer: boolean }[] = [
  {
    text: 'Chào mừng bạn đến thị trấn! Bạn là sinh viên vừa chuyển tới và mới gia nhập câu lạc bộ sơ cứu tình nguyện.',
    mood: 'happy',
    withPlayer: false,
  },
  {
    text: `Mình là ${GUIDE_NAME}, bạn đồng hành của bạn. Ở đây, chuyện bất ngờ có thể xảy ra bất cứ lúc nào.`,
    mood: 'surprised',
    withPlayer: false,
  },
  {
    text: 'Quan sát, suy nghĩ, rồi mới hành động. An toàn luôn là trên hết. Sẵn sàng chưa nào?',
    mood: 'cheer',
    withPlayer: true,
  },
]

/** Short town intro shown once, before character creation. Skippable. */
export function TownIntroScreen() {
  const navigate = useNavigate()
  const markIntroSeen = useSave((s) => s.markIntroSeen)
  const [index, setIndex] = useState(0)
  const slide = SLIDES[index]
  const last = index === SLIDES.length - 1

  const finish = () => {
    markIntroSeen()
    navigate('/character', { replace: true })
  }

  return (
    <div className="flex h-full flex-col px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div className="flex justify-end">
        <button type="button" onClick={finish} className="px-2 py-2 font-bold text-blue-ink">
          Bỏ qua
        </button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border-4 border-cotton shadow-[0_5px_0_var(--color-mist-deep)]">
          <img src={art('town')} alt="" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-center gap-2">
            {slide.withPlayer && <Player className="h-36" />}
            <Guide mood={slide.mood} className="mb-2 h-28" />
          </div>
        </div>
        <Card className="w-full">
          <p className="font-display text-sm font-bold text-blue-ink">{GUIDE_NAME}</p>
          <p className="mt-1 min-h-[5.5rem] text-lg leading-snug">{slide.text}</p>
        </Card>
        <div className="flex gap-2" aria-hidden>
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`size-2.5 rounded-full ${i === index ? 'bg-blue-edge' : 'bg-mist-deep'}`}
            />
          ))}
        </div>
      </div>
      <Button size="lg" onClick={last ? finish : () => setIndex(index + 1)}>
        {last ? 'Bắt đầu' : 'Tiếp tục'}
      </Button>
    </div>
  )
}
