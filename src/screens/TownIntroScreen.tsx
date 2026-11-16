import { useState } from 'react'
import { useNavigate } from 'react-router'
import { GUIDE_NAME } from '@/content/areas'
import { useSave } from '@/state/save'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'

const SLIDES = [
  'Chào mừng bạn đến thị trấn! Bạn là sinh viên vừa chuyển tới và mới gia nhập câu lạc bộ sơ cứu tình nguyện.',
  `Mình là ${GUIDE_NAME}, bạn đồng hành của bạn. Ở đây, chuyện bất ngờ có thể xảy ra bất cứ lúc nào.`,
  'Quan sát, suy nghĩ, rồi mới hành động. An toàn luôn là trên hết. Sẵn sàng chưa nào?',
]

/** Short town intro shown once, before character creation. Skippable. */
export function TownIntroScreen() {
  const navigate = useNavigate()
  const markIntroSeen = useSave((s) => s.markIntroSeen)
  const [index, setIndex] = useState(0)
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
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <div className="text-8xl" aria-hidden>
          🏘️
        </div>
        <Card className="w-full">
          <p className="font-display text-sm font-bold text-blue-ink">{GUIDE_NAME}</p>
          <p className="mt-1 text-lg leading-snug">{SLIDES[index]}</p>
        </Card>
        <div className="flex gap-2" aria-hidden>
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`size-2.5 rounded-full ${i === index ? 'bg-blue' : 'bg-mist-deep'}`}
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
