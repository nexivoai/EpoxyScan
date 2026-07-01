'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { INTAKE_CONTENT } from '../constants'
import type { DraftPhoto } from '../types'

interface PhotoLightboxProps {
  photos: DraftPhoto[]
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

export function PhotoLightbox({ photos, index, onClose, onNavigate }: PhotoLightboxProps) {
  const photo = index !== null ? photos[index] : null

  function go(delta: number) {
    if (index === null || photos.length === 0) return
    onNavigate((index + delta + photos.length) % photos.length)
  }

  return (
    <Dialog
      open={photo !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="flex max-h-[90vh] max-w-3xl flex-col gap-3">
        <DialogTitle className="sr-only">{INTAKE_CONTENT.photoPreviewTitle}</DialogTitle>
        {photo && index !== null && (
          <>
            <div className="relative flex min-h-0 flex-1 items-center justify-center mt-5">
              <img
                src={photo.previewUrl}
                alt=""
                className="max-h-full max-w-full rounded-md object-contain"
              />
              {photos.length > 1 && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
                    onClick={() => go(-1)}
                    aria-label={INTAKE_CONTENT.prevPhoto}
                  >
                    <ChevronLeft className="size-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                    onClick={() => go(1)}
                    aria-label={INTAKE_CONTENT.nextPhoto}
                  >
                    <ChevronRight className="size-5" />
                  </Button>
                </>
              )}
            </div>
            <p className="shrink-0 text-center text-xs text-muted-foreground">
              {index + 1} / {photos.length}
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
