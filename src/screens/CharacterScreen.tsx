import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { useSave } from '@/state/save'
import { Button } from '@/ui/Button'
import { Card } from '@/ui/Card'

const MAX_NAME_LENGTH = 16

/** Character creation. The MVP has one fixed player character, so this only asks for a name. */
export function CharacterScreen() {
  const navigate = useNavigate()
  const hasProfile = useSave((s) => s.profile !== null)
  const createProfile = useSave((s) => s.createProfile)
  const [name, setName] = useState('')
  const trimmed = name.trim()

  if (hasProfile) return <Navigate to="/lobby" replace />

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!trimmed) return
    createProfile(trimmed)
    navigate('/lobby', { replace: true })
  }

  return (
    <form
      onSubmit={submit}
      className="flex h-full flex-col px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]"
    >
      <h1 className="text-center font-display text-3xl font-bold text-ink">Bạn tên là gì?</h1>
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        <div className="text-9xl" aria-hidden>
          🧑‍🎓
        </div>
        <Card className="w-full">
          <label htmlFor="player-name" className="font-display text-sm font-bold text-blue-ink">
            Tên nhân vật
          </label>
          <input
            id="player-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={MAX_NAME_LENGTH}
            autoComplete="off"
            placeholder="Nhập tên của bạn"
            className="mt-1 w-full rounded-2xl border-2 border-mist-deep bg-mist/50 px-4 py-3 text-xl font-bold outline-none focus:border-blue-edge"
          />
        </Card>
      </div>
      <Button size="lg" type="submit" disabled={!trimmed}>
        Vào thị trấn
      </Button>
    </form>
  )
}
