import type { LessonDef } from '@/game/types'
import { LEVELS } from './levels'

/**
 * Core emergency-safety lessons: open from the start, not tied to a level.
 * DRAFT content, not yet checked by a qualified reviewer.
 */
export const CORE_LESSONS: LessonDef[] = [
  {
    id: 'lesson-core-safety',
    title: 'An toàn trước tiên và gọi 115',
    levelId: null,
    areaId: null,
    signs: [
      'Có người bất tỉnh, khó thở, chảy máu nhiều hoặc đau dữ dội',
      'Hiện trường còn nguy hiểm: xe cộ, lửa, điện, khí gas, nước sâu',
    ],
    principles: [
      'Dừng lại và quan sát: bạn có an toàn khi lại gần không?',
      'Gọi người xung quanh đến giúp',
      'Gọi 115 và nói rõ: ở đâu, chuyện gì xảy ra, bao nhiêu người, tình trạng thế nào',
      'Làm theo hướng dẫn của tổng đài và ở lại với nạn nhân nếu an toàn',
    ],
    donts: [
      'Không lao vào nơi nguy hiểm để rồi trở thành nạn nhân thứ hai',
      'Không cúp máy trước khi tổng đài viên cho phép',
      'Không tự làm những việc mình chưa được hướng dẫn',
    ],
    callForHelp: ['Bất cứ khi nào bạn không chắc tình trạng có nghiêm trọng hay không'],
    source: null,
    reviewer: null,
    reviewedOn: null,
  },
]

const levelLessons = Object.values(LEVELS).flatMap((level) => (level ? [level.lesson] : []))

export const ALL_LESSONS: LessonDef[] = [...CORE_LESSONS, ...levelLessons]

export function findLesson(id: string): LessonDef | undefined {
  return ALL_LESSONS.find((l) => l.id === id)
}
