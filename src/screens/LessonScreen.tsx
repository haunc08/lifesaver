import { Navigate, useNavigate, useParams } from 'react-router'
import { CORE_LESSONS, findLesson } from '@/content/lessons'
import { useSave } from '@/state/save'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { Screen } from '@/ui/Screen'

function Section({ title, items, tone }: { title: string; items: string[]; tone: string }) {
  return (
    <Card>
      <h2 className={`font-display text-lg font-bold ${tone}`}>{title}</h2>
      <ul className="mt-1 list-disc space-y-1 pl-5 leading-snug">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Card>
  )
}

/** One lesson: signs, principles, what not to do, when to call for help. */
export function LessonScreen() {
  const navigate = useNavigate()
  const { lessonId } = useParams()
  const learned = useSave((s) => s.lessons)
  const lesson = lessonId ? findLesson(lessonId) : undefined
  const open = lesson && (CORE_LESSONS.includes(lesson) || learned.includes(lesson.id))

  if (!lesson || !open) return <Navigate to="/library" replace />

  const reviewed = lesson.source && lesson.reviewer && lesson.reviewedOn

  return (
    <Screen title={lesson.title} back="/library" className="space-y-3">
      <Section title="Dấu hiệu nhận biết" items={lesson.signs} tone="text-blue-ink" />
      <Section title="Nguyên tắc xử trí" items={lesson.principles} tone="text-mint-ink" />
      <Section title="Không nên làm" items={lesson.donts} tone="text-coral-ink" />
      <Section title="Khi nào cần gọi trợ giúp" items={lesson.callForHelp} tone="text-coral-ink" />

      {/* An unreviewed lesson carries no label (owner, 2026-11-16); a reviewed one names its source. */}
      {reviewed && (
        <p className="px-2 text-sm text-ink-soft">
          Nguồn: {lesson.source}. Thẩm định: {lesson.reviewer}, {lesson.reviewedOn}.
        </p>
      )}
      <p className="px-2 text-sm text-ink-soft">
        Trò chơi giúp bạn làm quen với sơ cứu, không thay thế một khoá học sơ cứu thực hành.
      </p>

      {lesson.levelId && (
        <Button
          className="w-full"
          icon="replay"
          onClick={() => navigate(`/level/${lesson.levelId}`)}
        >
          Chơi lại màn này
        </Button>
      )}
    </Screen>
  )
}
