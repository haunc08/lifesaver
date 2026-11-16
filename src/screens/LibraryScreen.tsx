import { useNavigate } from 'react-router'
import { ALL_LESSONS, CORE_LESSONS } from '@/content/lessons'
import { useSave } from '@/state/save'
import { Card } from '@/ui/Card'
import { Screen } from '@/ui/Screen'
import { Icon } from '@/ui/Icon'
import { Sticker } from '@/ui/Sticker'

/** Knowledge library: core lessons plus one lesson for every level played. */
export function LibraryScreen() {
  const navigate = useNavigate()
  const learned = useSave((s) => s.lessons)
  const fromLevels = ALL_LESSONS.filter((l) => learned.includes(l.id))

  return (
    <Screen title="Thư viện kiến thức" back="/lobby" className="space-y-3">
      {[...CORE_LESSONS, ...fromLevels].map((lesson) => (
        <button
          key={lesson.id}
          type="button"
          onClick={() => navigate(`/library/${lesson.id}`)}
          className="block w-full text-left transition-transform active:translate-y-0.5"
        >
          <Card className="flex items-center gap-3">
            <Sticker>
              <Icon name={lesson.levelId ? 'book' : 'kit'} />
            </Sticker>
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg font-bold text-ink">{lesson.title}</p>
              <p className="text-sm text-ink-soft">
                {lesson.levelId ? 'Bài học từ màn chơi' : 'Kiến thức cốt lõi'}
              </p>
            </div>
          </Card>
        </button>
      ))}
      {fromLevels.length === 0 && (
        <p className="px-2 pt-2 text-center text-ink-soft">
          Chơi một màn để nhận bài học đầu tiên của bạn.
        </p>
      )}
    </Screen>
  )
}
