'use client'

import { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { LIABILITY_COPY } from '@/constants/liability'
import { RATE_CARD } from '@/constants/rate-card'
import { cn } from '@/lib/utils'
import { FINISH_SYSTEMS } from '@/types/domain'
import { INTAKE_CONTENT } from '../constants'
import { countError } from '../lib/image-quality'
import { uploadPhotos } from '../lib/upload-photos'
import { intakeFormSchema, type IntakeFormValues } from '../schema'
import { createSubmission } from '../server/create-submission'
import type { DraftPhoto, UploadedPhoto } from '../types'
import { PhotoUploader } from './photo-uploader'

export function IntakeForm() {
  const [photos, setPhotos] = useState<DraftPhoto[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const uploadedRef = useRef<Map<string, UploadedPhoto>>(new Map())

  const form = useForm<IntakeFormValues>({
    resolver: zodResolver(intakeFormSchema),
    mode: 'onChange',
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      customerSqft: '',
      requestedFinish: 'flake',
      consent: false,
    },
  })

  const photosError = countError(photos.length)
  const canSubmit = form.formState.isValid && photosError === null && !submitting
  const errors = form.formState.errors

  async function onSubmit(values: IntakeFormValues) {
    if (photosError) {
      toast.error(photosError)
      return
    }

    setSubmitting(true)

    let uploaded: UploadedPhoto[]
    try {
      uploaded = await uploadPhotos(photos, uploadedRef.current)
    } catch {
      toast.error(INTAKE_CONTENT.errors.upload)
      setSubmitting(false)
      return
    }

    try {
      const result = await createSubmission({
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        customerEmail: values.customerEmail,
        customerSqft: values.customerSqft === '' ? null : Number(values.customerSqft),
        requestedFinish: values.requestedFinish,
        consent: values.consent,
        photos: uploaded,
      })

      if (!result.ok) {
        toast.error(result.error)
        return
      }

      photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl))
      uploadedRef.current.clear()
      setPhotos([])
      setSubmitted(true)
    } catch {
      toast.error(INTAKE_CONTENT.errors.submit)
    } finally {
      setSubmitting(false)
    }
  }

  function startNewSubmission() {
    form.reset()
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 bg-muted/40 p-8 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <h2 className="text-lg font-semibold">{INTAKE_CONTENT.success.title}</h2>
        <p className="max-w-sm text-sm text-muted-foreground">{INTAKE_CONTENT.success.body}</p>
        <Button type="button" onClick={startNewSubmission}>
          {INTAKE_CONTENT.submitAnother}
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={(event) => {
        void form.handleSubmit(onSubmit)(event)
      }}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-2">
        <Label>{INTAKE_CONTENT.photosLabel}</Label>
        <PhotoUploader photos={photos} onChange={setPhotos} disabled={submitting} />
        {photosError && (
          <p
            className={cn(
              'text-xs',
              photos.length > 0 ? 'text-destructive' : 'text-muted-foreground',
            )}
          >
            {photosError}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="customerName">{INTAKE_CONTENT.fields.name.label}</Label>
        <Input
          id="customerName"
          placeholder={INTAKE_CONTENT.fields.name.placeholder}
          {...form.register('customerName')}
        />
        <FieldError message={errors.customerName?.message} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="customerPhone">{INTAKE_CONTENT.fields.phone.label}</Label>
          <Input
            id="customerPhone"
            inputMode="tel"
            placeholder={INTAKE_CONTENT.fields.phone.placeholder}
            {...form.register('customerPhone')}
          />
          <FieldError message={errors.customerPhone?.message} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="customerEmail">{INTAKE_CONTENT.fields.email.label}</Label>
          <Input
            id="customerEmail"
            type="email"
            placeholder={INTAKE_CONTENT.fields.email.placeholder}
            {...form.register('customerEmail')}
          />
          <FieldError message={errors.customerEmail?.message} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="customerSqft">{INTAKE_CONTENT.fields.sqft.label}</Label>
          <Input
            id="customerSqft"
            inputMode="numeric"
            placeholder={INTAKE_CONTENT.fields.sqft.placeholder}
            {...form.register('customerSqft')}
          />
          <FieldError message={errors.customerSqft?.message} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>{INTAKE_CONTENT.fields.finish.label}</Label>
          <Controller
            control={form.control}
            name="requestedFinish"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FINISH_SYSTEMS.map((finish) => (
                    <SelectItem key={finish} value={finish}>
                      {RATE_CARD.systems[finish].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <Controller
        control={form.control}
        name="consent"
        render={({ field }) => (
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2.5">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
              <span className="text-xs leading-relaxed text-muted-foreground">
                {LIABILITY_COPY}
              </span>
            </div>
            <FieldError message={errors.consent?.message} />
          </div>
        )}
      />

      <Button type="submit" disabled={!canSubmit}>
        {submitting ? INTAKE_CONTENT.submitting : INTAKE_CONTENT.submit}
      </Button>
    </form>
  )
}
