import type { ReactNode } from 'react'

/** Line icons drawn in the text colour, so they sit in the palette (no emoji). */
const PATHS = {
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  settings: (
    <>
      <path d="M4 7h8M20 7h-2M4 17h2M12 17h8" />
      <circle cx="15" cy="7" r="2.5" />
      <circle cx="9" cy="17" r="2.5" />
    </>
  ),
  map: (
    <>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  book: (
    <>
      <path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5Z" />
      <path d="M12 6.5v13" />
    </>
  ),
  bulb: (
    <>
      <path d="M9.5 18h5M10.5 21h3" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1.2 1.5 1.2 2.5h5.6c0-1 .5-1.8 1.2-2.5A6 6 0 0 0 12 3Z" />
    </>
  ),
  pause: <path d="M8.5 5.5v13M15.5 5.5v13" strokeWidth="3.2" />,
  replay: (
    <>
      <path d="M4.5 12a7.5 7.5 0 1 0 2.4-5.5" />
      <path d="M4.5 4.5v4.6h4.6" />
    </>
  ),
  kit: (
    <>
      <rect x="3.5" y="7.5" width="17" height="12" rx="3" />
      <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M12 11v5M9.5 13.5h5" />
    </>
  ),
  play: <path d="M8 5.5v13l10.5-6.5L8 5.5Z" />,
  next: <path d="M5 12h14M13 6l6 6-6 6" />,
  back: <path d="M14.5 5.5 8 12l6.5 6.5" strokeWidth="2.8" />,
  exit: (
    <>
      <path d="M10 4.5H6.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2H10" />
      <path d="M10 12h10M16 8l4 4-4 4" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" strokeWidth="2.8" />,
  close: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" strokeWidth="2.8" />,
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  undo: (
    <>
      <path d="M8 8.5h7a4.5 4.5 0 0 1 0 9h-4" />
      <path d="M11.5 5 8 8.5l3.5 3.5" />
    </>
  ),
  skip: <path d="m5 6 6 6-6 6M13 6l6 6-6 6" />,
  trash: (
    <>
      <path d="M4.5 7h15M9.5 7V5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2" />
      <path d="M6.5 7l.8 11a2 2 0 0 0 2 1.9h5.4a2 2 0 0 0 2-1.9L17.5 7" />
    </>
  ),
  unlock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2.5" />
      <path d="M8 11V8a4 4 0 0 1 7.5-2" />
    </>
  ),
  list: <path d="M9 7h11M9 12h11M9 17h11M4.5 7h.01M4.5 12h.01M4.5 17h.01" />,
  star: (
    <path
      d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.9L12 16.9l-5.3 2.8 1.1-5.9-4.3-4.1 5.9-.8L12 3.5Z"
      fill="currentColor"
    />
  ),
  phone: (
    <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A15.5 15.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z" />
  ),
  erase: (
    <>
      <path d="M9 5.5h10.5v13H9L3.5 12 9 5.5Z" />
      <path d="m12 9.5 5 5M17 9.5l-5 5" />
    </>
  ),
  grip: <path d="M5 9h14M5 15h14" strokeWidth="2.6" />,
  soon: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof PATHS

export function Icon({ name, className = 'size-6' }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`shrink-0 ${className}`}
    >
      {PATHS[name]}
    </svg>
  )
}
