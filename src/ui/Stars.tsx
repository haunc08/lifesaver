export function Stars({ count, className = '' }: { count: number; className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 ${className}`} aria-label={`${count} trên 3 sao`}>
      {[1, 2, 3].map((n) => (
        <span key={n} aria-hidden className={n <= count ? 'text-butter-edge' : 'text-mist-deep'}>
          {n <= count ? '★' : '☆'}
        </span>
      ))}
    </span>
  )
}
