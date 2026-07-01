'use client'

import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FieldError } from '@/components/ui/field-error'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { RATE_CARD } from '@/constants/rate-card'
import { formatPriceRange } from '@/lib/format'
import type { Submission } from '@/types/db'
import { FINISH_SYSTEMS } from '@/types/domain'
import { REVIEW_CONTENT } from '../constants'
import { approvalFormSchema, type ApprovalFormValues } from '../schema'
import { approveSubmission, resendCustomerSms } from '../server/approve-submission'

function ApprovedPanel({
  submission,
  resending,
  onResend,
}: {
  submission: Submission
  resending: boolean
  onResend: () => void
}) {
  const a = REVIEW_CONTENT.approved
  const { contractorPriceLow: low, contractorPriceHigh: high } = submission
  const priceText = low !== null && high !== null ? formatPriceRange(low, high) : a.inspection

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-5 text-primary" />
          <h2 className="text-sm font-semibold">{a.title}</h2>
        </div>
        <p className="text-sm text-muted-foreground">{a.body}</p>
        <dl className="flex flex-col gap-2">
          <div className="flex justify-between gap-4">
            <dt className="text-xs text-muted-foreground">{a.priceLabel}</dt>
            <dd className="text-sm font-medium">{priceText}</dd>
          </div>
          {submission.contractorSystem && (
            <div className="flex justify-between gap-4">
              <dt className="text-xs text-muted-foreground">{a.systemLabel}</dt>
              <dd className="text-sm font-medium">
                {RATE_CARD.systems[submission.contractorSystem].label}
              </dd>
            </div>
          )}
          {submission.contractorNotes && (
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs text-muted-foreground">{a.notesLabel}</dt>
              <dd className="text-sm">{submission.contractorNotes}</dd>
            </div>
          )}
        </dl>
        <Button type="button" variant="outline" onClick={onResend} disabled={resending}>
          {resending ? a.resending : a.resend}
        </Button>
      </CardContent>
    </Card>
  )
}

export function ReviewForm({ submission }: { submission: Submission }) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)

  const form = useForm<ApprovalFormValues>({
    resolver: zodResolver(approvalFormSchema),
    mode: 'onChange',
    defaultValues: {
      priceLow: submission.priceLow !== null ? String(submission.priceLow) : '',
      priceHigh: submission.priceHigh !== null ? String(submission.priceHigh) : '',
      system: submission.aiRecommendedSystem ?? submission.requestedFinish ?? 'flake',
      notes: '',
    },
  })

  async function handleResend() {
    setResending(true)
    try {
      const result = await resendCustomerSms(submission.reviewToken)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success(
        result.data.smsSent
          ? REVIEW_CONTENT.toasts.resendSent
          : REVIEW_CONTENT.toasts.resendNotSent,
      )
    } catch {
      toast.error(REVIEW_CONTENT.errors.generic)
    } finally {
      setResending(false)
    }
  }

  if (submission.status === 'approved') {
    return <ApprovedPanel submission={submission} resending={resending} onResend={handleResend} />
  }

  async function onSubmit(values: ApprovalFormValues) {
    setSubmitting(true)
    try {
      const result = await approveSubmission({
        reviewToken: submission.reviewToken,
        priceLow: values.priceLow === '' ? null : Number(values.priceLow),
        priceHigh: values.priceHigh === '' ? null : Number(values.priceHigh),
        system: values.system,
        notes: values.notes,
      })
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success(
        result.data.smsSent
          ? REVIEW_CONTENT.toasts.approvedSent
          : REVIEW_CONTENT.toasts.approvedNotSent,
      )
      router.refresh()
    } catch {
      toast.error(REVIEW_CONTENT.errors.generic)
    } finally {
      setSubmitting(false)
    }
  }

  const errors = form.formState.errors
  const f = REVIEW_CONTENT.form

  return (
    <Card>
      <CardContent className="p-5">
        <form
          onSubmit={(event) => {
            void form.handleSubmit(onSubmit)(event)
          }}
          className="flex flex-col gap-4"
        >
          <h2 className="text-sm font-semibold">{f.title}</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="priceLow">{f.priceLow}</Label>
              <Input id="priceLow" inputMode="numeric" {...form.register('priceLow')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="priceHigh">{f.priceHigh}</Label>
              <Input id="priceHigh" inputMode="numeric" {...form.register('priceHigh')} />
            </div>
          </div>
          <FieldError message={errors.priceHigh?.message} />
          <p className="text-xs text-muted-foreground">{f.priceHint}</p>
          <div className="flex flex-col gap-1.5">
            <Label>{f.system}</Label>
            <Controller
              control={form.control}
              name="system"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FINISH_SYSTEMS.map((system) => (
                      <SelectItem key={system} value={system}>
                        {RATE_CARD.systems[system].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">{f.notes}</Label>
            <Textarea id="notes" {...form.register('notes')} />
            <FieldError message={errors.notes?.message} />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? f.approving : f.approve}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
