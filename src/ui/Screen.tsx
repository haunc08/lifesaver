import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'

interface Props {
  title?: string
  /** Where the back button goes; omit to hide it. */
  back?: string
  children: ReactNode
  className?: string
}

/** Standard page layout: optional title bar, then scrollable content. */
export function Screen({ title, back, children, className = '' }: Props) {
  const navigate = useNavigate()
  return (
    <div className="flex h-full flex-col">
      {(title || back) && (
        <header className="flex items-center gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-2">
          {back && (
            <button
              type="button"
              aria-label="Quay lại"
              onClick={() => navigate(back)}
              className="flex size-11 items-center justify-center rounded-2xl bg-cotton text-xl font-bold text-blue-ink shadow-[0_3px_0_var(--color-mist-deep)] active:translate-y-[3px] active:shadow-none"
            >
              ‹
            </button>
          )}
          {title && <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>}
        </header>
      )}
      <main
        className={`flex-1 overflow-y-auto px-4 pt-2 pb-[max(1.25rem,env(safe-area-inset-bottom))] ${className}`}
      >
        {children}
      </main>
    </div>
  )
}
