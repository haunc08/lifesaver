/**
 * Stand-in for the original logo: "Life" in blue, "saver" in red, bubble
 * lettering. Replace with the original artwork when it is supplied.
 */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <h1 className={`bubble-text font-display leading-none font-extrabold ${className}`}>
      <span className="text-blue-edge">Life</span>
      <span className="text-coral-edge">saver</span>
    </h1>
  )
}
