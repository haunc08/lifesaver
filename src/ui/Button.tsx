import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'loud' | 'danger' | 'success' | 'plain'
type Size = 'md' | 'lg'

const FACE: Record<Variant, string> = {
  primary: 'bg-blue text-ink shadow-[0_5px_0_var(--color-blue-edge)]',
  // The one loud thing on a screen, such as the lobby's play button.
  loud: 'bg-butter text-ink shadow-[0_5px_0_var(--color-butter-edge)]',
  danger: 'bg-coral text-ink shadow-[0_5px_0_var(--color-coral-edge)]',
  success: 'bg-mint text-ink shadow-[0_5px_0_var(--color-mint-edge)]',
  plain: 'bg-cotton text-ink shadow-[0_5px_0_var(--color-mist-deep)]',
}

const SIZE: Record<Size, string> = {
  md: 'px-5 py-2.5 text-lg',
  lg: 'px-8 py-4 text-2xl',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

/** The chunky rounded button used everywhere; presses down into its own shadow. */
export function Button({ variant = 'primary', size = 'md', className = '', ...rest }: Props) {
  return (
    <button
      type="button"
      className={`rounded-2xl font-display leading-tight font-bold transition-transform active:translate-y-[5px] active:shadow-none disabled:pointer-events-none disabled:opacity-45 ${FACE[variant]} ${SIZE[size]} ${className}`}
      {...rest}
    />
  )
}
