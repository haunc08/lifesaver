import { useState } from 'react'
import { useSave, type Settings } from '@/state/save'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'
import { Screen } from '@/ui/Screen'

function Toggle({ label, setting }: { label: string; setting: keyof Settings }) {
  const on = useSave((s) => s.settings[setting])
  const setSetting = useSave((s) => s.setSetting)
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setSetting(setting, !on)}
      className="flex w-full items-center justify-between py-2 text-left text-lg"
    >
      {label}
      <span
        className={`flex h-8 w-14 items-center rounded-full p-1 transition-colors ${on ? 'bg-mint-edge' : 'bg-mist-deep'}`}
      >
        <span
          className={`size-6 rounded-full bg-cotton transition-transform ${on ? 'translate-x-6' : ''}`}
        />
      </span>
    </button>
  )
}

export function SettingsScreen() {
  const resetAll = useSave((s) => s.resetAll)
  const [confirming, setConfirming] = useState(false)

  return (
    <Screen title="Cài đặt" back="/lobby" className="space-y-3">
      <Card>
        <Toggle label="Nhạc và tiếng nền" setting="music" />
        <Toggle label="Hiệu ứng âm thanh" setting="sfx" />
      </Card>

      <Card>
        <h2 className="font-display text-lg font-bold text-ink">Dữ liệu chơi</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Xoá nhân vật, tiến trình và bài học đã lưu trên thiết bị này.
        </p>
        {confirming ? (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Button variant="plain" icon="close" onClick={() => setConfirming(false)}>
              Giữ lại
            </Button>
            {/* RequireProfile sends the player back to the start once the profile is gone. */}
            <Button variant="danger" icon="trash" onClick={resetAll}>
              Xoá hết
            </Button>
          </div>
        ) : (
          <Button
            variant="plain"
            icon="trash"
            className="mt-3 w-full"
            onClick={() => setConfirming(true)}
          >
            Xoá dữ liệu
          </Button>
        )}
      </Card>
    </Screen>
  )
}
