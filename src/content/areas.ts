import type { AreaDef } from '@/game/types'

/** MVP areas in unlock order. Phase 2 adds the other five. */
export const AREAS: AreaDef[] = [
  {
    id: 'school',
    name: 'Trường học',
    tagline: 'Lớp học, thư viện, sân thể thao, căng tin',
    emoji: '🏫',
  },
  { id: 'dormitory', name: 'Ký túc xá', tagline: 'Phòng ở, bếp chung, ban công', emoji: '🏠' },
  { id: 'streets', name: 'Đường phố', tagline: 'Ngã tư, trạm xe buýt, vỉa hè', emoji: '🚦' },
  { id: 'food-district', name: 'Phố ẩm thực', tagline: 'Quán cà phê, tiệm bánh, bếp', emoji: '🍜' },
  { id: 'park', name: 'Công viên', tagline: 'Đường chạy bộ, bãi dã ngoại', emoji: '🌳' },
]

/** Placeholder name for the guide character; see docs/plan.md, open questions. */
export const GUIDE_NAME = 'Bông'
