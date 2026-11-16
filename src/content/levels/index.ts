import type { LevelDef, LevelOutline } from '@/game/types'

/**
 * Every MVP level in play order, built or not. The map and the unlock rules read
 * this list, so a planned level shows up as "coming soon" until it has a LevelDef.
 */
export const LEVEL_OUTLINE: LevelOutline[] = [
  { id: 'school-01', areaId: 'school', title: 'Tiết bốn oi ả', theme: 'Ngất xỉu' },
  { id: 'school-02', areaId: 'school', title: 'Giờ tự học ở thư viện', theme: 'Co giật' },
  { id: 'school-03', areaId: 'school', title: 'Trận bóng chiều thứ sáu', theme: 'Bong gân' },
  { id: 'dormitory-01', areaId: 'dormitory', title: 'Đĩa trái cây đêm khuya', theme: 'Đứt tay' },
  { id: 'dormitory-02', areaId: 'dormitory', title: 'Mùi lạ trong bếp chung', theme: 'Rò rỉ gas' },
  {
    id: 'streets-01',
    areaId: 'streets',
    title: 'Ngã tư giờ tan tầm',
    theme: 'An toàn hiện trường',
  },
  { id: 'streets-02', areaId: 'streets', title: 'Cú ngã ở trạm xe buýt', theme: 'Chảy máu' },
  {
    id: 'food-district-01',
    areaId: 'food-district',
    title: 'Miếng bánh vội vàng',
    theme: 'Hóc dị vật',
  },
  { id: 'food-district-02', areaId: 'food-district', title: 'Ấm nước sau quầy', theme: 'Bỏng' },
  {
    id: 'park-01',
    areaId: 'park',
    title: 'Chạy bộ giữa trưa',
    theme: 'Say nắng, kiệt sức vì nóng',
  },
  { id: 'park-02', areaId: 'park', title: 'Vị khách không mời', theme: 'Côn trùng đốt' },
  {
    id: 'park-03',
    areaId: 'park',
    title: 'Buổi dã ngoại cuối tuần',
    theme: 'Chấn thương thể thao',
  },
]

/**
 * Levels that are actually playable, by id. Every level file in this folder
 * default-exports its LevelDef and is picked up here automatically.
 */
const modules = import.meta.glob<LevelDef>('./*-*.ts', { eager: true, import: 'default' })

export const LEVELS: Record<string, LevelDef | undefined> = Object.fromEntries(
  Object.values(modules).map((level) => [level.id, level]),
)
