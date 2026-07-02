import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import type { Photo, Submission } from '@/types/db'
import { REVIEW_CONTENT } from '../constants'
import { toReviewSummaryView } from '../lib/summary'

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value}</dd>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <h2 className="text-sm font-semibold">{title}</h2>
        {children}
      </CardContent>
    </Card>
  )
}

export function ReviewSummary({ submission, photos }: { submission: Submission; photos: Photo[] }) {
  const c = REVIEW_CONTENT
  const view = toReviewSummaryView(submission)

  return (
    <>
      <Section title={c.sections.photos}>
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {photos.map((photo) => (
            <li key={photo.id} className="aspect-square overflow-hidden rounded-md border">
              <img src={photo.url} alt="" className="size-full object-cover" />
            </li>
          ))}
        </ul>
      </Section>

      <Section title={c.sections.customer}>
        <dl className="grid grid-cols-2 gap-4">
          <Field label={c.customer.name} value={submission.customerName} />
          <Field label={c.customer.phone} value={submission.customerPhone} />
          <Field label={c.customer.email} value={submission.customerEmail} />
          <Field label={c.customer.requestedFinish} value={view.requestedFinish} />
          <Field label={c.customer.providedSqft} value={view.providedSqft} />
        </dl>
      </Section>

      <Section title={c.sections.assessment}>
        {view.isNotFloor ? (
          <p className="text-sm text-muted-foreground">{c.verification.notFloorAssessment}</p>
        ) : (
          <>
            {view.needsVerification && (
              <div className="flex flex-col gap-0.5 border-l-2 border-amber-500 pl-3">
                <p className="text-sm font-semibold text-amber-600">{c.verification.heading}</p>
                {view.verificationReasonLabel && (
                  <p className="text-sm text-amber-600">{view.verificationReasonLabel}</p>
                )}
              </div>
            )}
            <dl className="grid grid-cols-2 gap-4">
              <Field label={c.assessment.projectType} value={view.projectType} />
              <Field label={c.assessment.sqftRange} value={view.sqftRange} />
              <Field label={c.assessment.recommendedSystem} value={view.recommendedSystem} />
              <Field label={c.assessment.crackSeverity} value={view.crackSeverity} />
              <Field label={c.assessment.complexity} value={view.complexity} />
              <Field label={c.assessment.imageQuality} value={view.imageQuality} />
              <Field label={c.assessment.confidence} value={view.confidence} />
              <div className="col-span-2">
                <Field label={c.assessment.surfaceFlags} value={view.surfaceFlags} />
              </div>
            </dl>
          </>
        )}
      </Section>

      <Section title={c.sections.estimate}>
        <Field label={c.estimate.priceLabel} value={view.priceText} />
        {submission.status === 'inspection_required' && (
          <p className="text-sm text-amber-600">{c.estimate.inspection}</p>
        )}
      </Section>
    </>
  )
}
