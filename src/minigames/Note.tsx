export interface NoteData {
  tone: 'good' | 'warn' | 'bad'
  text: string
}

const TONE: Record<NoteData['tone'], string> = {
  good: 'border-mint-edge bg-mint/25 text-mint-ink',
  warn: 'border-butter-edge bg-butter/30 text-ink',
  bad: 'border-coral-edge bg-coral/20 text-coral-ink',
}

const MARK: Record<NoteData['tone'], string> = { good: '✓', warn: '!', bad: '✕' }

/** One line of feedback under a mini-game. Keeps its height so the layout does not jump. */
export function Note({ note, idle }: { note: NoteData | null; idle: string }) {
  if (!note) return <p className="min-h-12 px-1 text-center text-sm text-ink-soft">{idle}</p>
  return (
    <p
      // The key replays the motion each time the message changes.
      key={note.text}
      role="status"
      className={`flex min-h-12 items-center gap-2 rounded-2xl border-2 px-3 py-2 text-sm leading-snug ${note.tone === 'good' ? 'animate-pop' : 'animate-shake'} ${TONE[note.tone]}`}
    >
      <span aria-hidden className="font-display text-base font-bold">
        {MARK[note.tone]}
      </span>
      {note.text}
    </p>
  )
}
