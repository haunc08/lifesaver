import type { HTMLAttributes } from 'react'
import { art } from '@/art'

interface Props extends HTMLAttributes<HTMLDivElement> {
  /** Art id of the scene illustration; the level id. */
  artId: string
  /** Name of the place, shown only while the illustration is missing. */
  scene: string
  /** Zoom towards this point (percent coordinates), or null for the full view. */
  focus?: { x: number; y: number } | null
}

const ZOOM = 1.7

/**
 * First-person view of the scene. Children are positioned over the illustration
 * in percent coordinates and move with it when the view zooms in on a point.
 */
export function SceneBox({ artId, scene, focus = null, children, className = '', ...rest }: Props) {
  const image = art(artId)
  return (
    <div
      className={`relative aspect-[4/3] w-full touch-manipulation overflow-hidden rounded-3xl border-4 border-cotton bg-blue/35 shadow-[0_5px_0_var(--color-mist-deep)] ${className}`}
      data-zoomed={focus ? '' : undefined}
      {...rest}
    >
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{
          transformOrigin: focus ? `${focus.x}% ${focus.y}%` : '50% 50%',
          transform: focus ? `scale(${ZOOM})` : 'none',
        }}
      >
        {image ? (
          <img
            src={image}
            alt={scene}
            draggable={false}
            className="absolute inset-0 size-full object-cover select-none"
          />
        ) : (
          <span className="absolute right-3 bottom-2 text-xs text-ink-soft">
            {scene} (tranh tạm)
          </span>
        )}
        {children}
      </div>
    </div>
  )
}
