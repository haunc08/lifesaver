import type { CallConfig } from '@/game/types'

/** Vietnam's three emergency numbers and what each is for. */
export const SERVICES: Record<CallConfig['number'], string> = {
  '113': 'công an',
  '114': 'cứu hoả và cứu nạn',
  '115': 'cấp cứu y tế',
}
