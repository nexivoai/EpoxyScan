import { Camera } from 'lucide-react'
import { PHOTO_RECOMMENDATION, SCAN_TIPS } from '../constants'
import { ExamplesModal } from './examples-modal'

export function ScanTips() {
  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-sm font-semibold">
        <Camera className="size-4 text-primary" />
        {SCAN_TIPS.title}
      </h2>
      <ol className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
        {SCAN_TIPS.items.map((item, index) => (
          <li key={item} className="flex gap-2">
            <span className="font-medium text-primary">{index + 1}.</span>
            {item}
          </li>
        ))}
      </ol>
      <p className="mt-4 text-sm font-medium">{SCAN_TIPS.footer}</p>
      <p className="mt-1 text-xs text-muted-foreground">{PHOTO_RECOMMENDATION}</p>
      <div className="mt-4">
        <ExamplesModal />
      </div>
    </section>
  )
}
