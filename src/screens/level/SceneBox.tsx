import type { HTMLAttributes } from 'react'
import { art } from '@/art'

interface Props extends HTMLAttributes<HTMLDivElement> {
  /** Art id of the scene illustration; the level id. */
  artId: string
  /** Name of the place, shown only while the illustration is missing. */
  scene: string
}

/**
 * First-person view of the scene. Children are positioned over the illustration
 * in percent coordinates.
 */
export function SceneBox({ artId, scene, children, className = '', ...rest }: Props) {
  const image = art(artId)
  return (
    <div
      className={`relative aspect-[4/3] w-full touch-manipulation overflow-hidden rounded-3xl border-4 border-cotton bg-blue/35 shadow-[0_5px_0_var(--color-mist-deep)] ${className}`}
      {...rest}
    >
      {image ? (
        <img
          src={image}
          alt={scene}
          draggable={false}
          className="absolute inset-0 size-full object-cover select-none"
        />
      ) : (
        <span className="absolute right-3 bottom-2 text-xs text-ink-soft">{scene} (tranh tạm)</span>
      )}
      {children}
    </div>
  )
}
