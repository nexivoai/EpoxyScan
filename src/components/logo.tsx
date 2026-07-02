import { APP } from '@/constants/content'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)} aria-label={APP.name}>
      <svg viewBox="0 0 32 32" className="size-9 text-primary" aria-hidden="true">
        <rect x="3" y="3" width="26" height="26" rx="8" fill="currentColor" />
        <path
          d="M8 21 L24 11"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.92"
        />
        <g fill="#ffffff">
          <circle cx="11.5" cy="12.5" r="1.5" opacity="0.9" />
          <circle cx="20.5" cy="20.5" r="1.5" opacity="0.9" />
          <circle cx="15.5" cy="16" r="1.2" opacity="0.6" />
        </g>
      </svg>
      <span className="text-xl font-semibold tracking-tight">{APP.name}</span>
    </span>
  )
}
