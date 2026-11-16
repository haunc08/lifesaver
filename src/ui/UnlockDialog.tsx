import { Button } from './Button'
import { Dialog } from './Dialog'

interface Props {
  /** Name of the locked area or level. */
  name: string
  /** How it opens through normal play. */
  rule: string
  onUnlock: () => void
  onClose: () => void
}

/** Shown when a locked area or level is tapped: explains the rule and offers to open it anyway. */
export function UnlockDialog({ name, rule, onUnlock, onClose }: Props) {
  return (
    <Dialog title={name}>
      <p className="text-lg leading-snug">{rule}</p>
      <p className="-mt-2 leading-snug text-ink-soft">Bạn cũng có thể mở khoá ngay để chơi thử.</p>
      <Button icon="unlock" onClick={onUnlock}>
        Mở khoá ngay
      </Button>
      <Button variant="plain" icon="close" onClick={onClose}>
        Để sau
      </Button>
    </Dialog>
  )
}
