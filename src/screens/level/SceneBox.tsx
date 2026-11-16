import type { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  scene: string
}

/**
 * First-person view of the scene. A plain placeholder until scene illustrations
 * exist; children are positioned over it in percent coordinates.
 */
export function SceneBox({ scene, children, className = '', ...rest }: Props) {
  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-3xl border-4 border-cotton bg-blue/35 shadow-[0_5px_0_var(--color-mist-deep)] ${className}`}
      {...rest}
    >
      <span className="absolute right-3 bottom-2 text-xs text-ink-soft">{scene} (tranh tạm)</span>
      {children}
    </div>
  )
}
