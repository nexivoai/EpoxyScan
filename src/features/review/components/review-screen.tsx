import { LIABILITY_COPY } from '@/constants/liability'
import { REVIEW_CONTENT } from '../constants'
import type { ReviewData } from '../server/get-submission'
import { ReviewForm } from './review-form'
import { ReviewSummary } from './review-summary'

export function ReviewScreen({ submission, photos }: ReviewData) {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">{REVIEW_CONTENT.title}</h1>
        <p className="text-muted-foreground">{REVIEW_CONTENT.subtitle}</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-5 lg:items-start">
        <div className="flex flex-col gap-6 lg:col-span-3">
          <ReviewSummary submission={submission} photos={photos} />
        </div>
        <div className="lg:col-span-2">
          <ReviewForm submission={submission} />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{LIABILITY_COPY}</p>
    </main>
  )
}
