import type { ButtonHTMLAttributes } from 'react'
import { Icon, type IconName } from './Icon'

type Variant = 'primary' | 'loud' | 'danger' | 'success' | 'plain'
type Size = 'md' | 'lg'

const FACE: Record<Variant, string> = {
  primary: 'border-blue bg-blue text-ink shadow-[0_5px_0_var(--color-blue-edge)]',
  // The one loud thing on a screen, such as the home screen's play button.
  loud: 'border-butter bg-butter text-ink shadow-[0_5px_0_var(--color-butter-edge)]',
  danger: 'border-coral bg-coral text-ink shadow-[0_5px_0_var(--color-coral-edge)]',
  success: 'border-mint bg-mint text-ink shadow-[0_5px_0_var(--color-mint-edge)]',
  // Outlined, so it still reads as a button on a card of the same colour.
  plain: 'border-mist-edge bg-cotton text-ink shadow-[0_5px_0_var(--color-mist-edge)]',
}

const SIZE: Record<Size, string> = {
  md: 'px-5 py-2.5 text-lg',
  lg: 'px-8 py-4 text-2xl',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  /** Line icon shown before the label; the label is then centred. */
  icon?: IconName
}

/** The chunky rounded button used everywhere; presses down into its own shadow. */
export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  children,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={`rounded-2xl border-2 font-display leading-tight font-bold transition-transform active:translate-y-[5px] active:shadow-none disabled:pointer-events-none disabled:opacity-45 ${icon ? 'inline-flex items-center justify-center gap-2' : ''} ${FACE[variant]} ${SIZE[size]} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} className={size === 'lg' ? 'size-7' : 'size-6'} />}
      {children}
    </button>
  )
}
