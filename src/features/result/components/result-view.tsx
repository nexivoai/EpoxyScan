import { Card, CardContent } from '@/components/ui/card'
import { LIABILITY_COPY } from '@/constants/liability'
import { RATE_CARD } from '@/constants/rate-card'
import { formatPriceRange } from '@/lib/format'
import type { Submission } from '@/types/db'
import { isIrrelevantSubject } from '@/types/domain'
import { RESULT_CONTENT } from '../constants'

export function ResultView({ submission }: { submission: Submission }) {
  const c = RESULT_CONTENT
  const { contractorPriceLow: low, contractorPriceHigh: high } = submission
  const approved = submission.status === 'approved'
  const notFloor = isIrrelevantSubject(submission.verificationReason)

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-6 px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">{c.title}</h1>
      <Card>
        <CardContent className="flex flex-col gap-4 p-6">
          {!approved ? (
            <>
              <h2 className="text-lg font-semibold">{c.pending.title}</h2>
              <p className="text-sm text-muted-foreground">{c.pending.body}</p>
            </>
          ) : low !== null && high !== null ? (
            <>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">{c.approved.estimateLabel}</span>
                <span className="text-3xl font-semibold">{formatPriceRange(low, high)}</span>
              </div>
              {submission.contractorSystem && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">{c.approved.systemLabel}</span>
                  <span className="text-sm font-medium">
                    {RATE_CARD.systems[submission.contractorSystem].label}
                  </span>
                </div>
              )}
              <p className="text-sm text-muted-foreground">{c.approved.body}</p>
            </>
          ) : notFloor ? (
            <>
              <h2 className="text-lg font-semibold">{c.notFloor.title}</h2>
              <p className="text-sm text-muted-foreground">{c.notFloor.body}</p>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold">{c.inspection.title}</h2>
              <p className="text-sm text-muted-foreground">{c.inspection.body}</p>
            </>
          )}
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">{LIABILITY_COPY}</p>
    </main>
  )
}
