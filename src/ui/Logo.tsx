import cross from '@/assets/logo/cross.svg'
import pulse from '@/assets/logo/pulse.svg'
import siren from '@/assets/logo/siren.svg'

/**
 * The logo: "Life" in blue and "saver" in coral as bubble lettering, with the
 * decorations of the original artwork redrawn flat in the game's palette: a beacon
 * behind the top of the letters, a cross at each side and a heartbeat line with a cross underneath.
 * The crosses are mint, not red. Everything is sized in em, so the font size
 * given through `className` scales the whole logo; nothing in it moves.
 */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`inline-flex flex-col items-center leading-none ${className}`}>
      <img src={siren} alt="" className="bubble-art -mb-[0.27em] h-[0.78em]" />
      {/* The letters sit in front of the beacon, which tucks in behind them. */}
      <div className="relative z-10">
        <img
          src={cross}
          alt=""
          className="bubble-art absolute top-[0em] -left-[0.36em] h-[0.46em] -rotate-12"
        />
        <h1 className="bubble-text font-display font-extrabold">
          <span className="text-blue-edge">Life</span>
          <span className="text-coral-edge">saver</span>
        </h1>
        <img
          src={cross}
          alt=""
          className="bubble-art absolute -right-[0.38em] bottom-[0.02em] h-[0.46em] rotate-12"
        />
      </div>
      <img src={pulse} alt="" className="bubble-art -mt-[0.08em] w-[3.5em]" />
    </div>
  )
}
