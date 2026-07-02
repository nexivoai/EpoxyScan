'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { INTAKE_CONTENT, PHOTO_LIMITS } from '../constants'
import { inspectFile } from '../lib/image-quality'
import type { DraftPhoto } from '../types'
import { PhotoLightbox } from './photo-lightbox'

interface PhotoUploaderProps {
  photos: DraftPhoto[]
  onChange: (photos: DraftPhoto[]) => void
  disabled?: boolean
}

export function PhotoUploader({ photos, onChange, disabled }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [inspecting, setInspecting] = useState(false)

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || inspecting) return

    const room = Math.max(0, PHOTO_LIMITS.maxCount - photos.length)
    const incoming = Array.from(fileList).slice(0, room)
    if (incoming.length === 0) return

    setInspecting(true)
    try {
      const drafts: DraftPhoto[] = []
      for (const file of incoming) {
        const check = await inspectFile(file)
        if (check.blocked) {
          toast.error(`${file.name}: ${check.warning}`)
          continue
        }
        drafts.push({
          id: crypto.randomUUID(),
          file,
          previewUrl: URL.createObjectURL(file),
          width: check.width,
          height: check.height,
          warning: check.warning,
        })
      }
      if (drafts.length > 0) onChange([...photos, ...drafts])
    } finally {
      setInspecting(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  function removePhoto(id: string) {
    const target = photos.find((photo) => photo.id === id)
    if (target) URL.revokeObjectURL(target.previewUrl)
    const next = photos.filter((photo) => photo.id !== id)
    onChange(next)
    setActiveIndex((current) => {
      if (current === null || next.length === 0) return null
      return Math.min(current, next.length - 1)
    })
  }

  const atLimit = photos.length >= PHOTO_LIMITS.maxCount

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept={PHOTO_LIMITS.acceptedTypes.join(',')}
        multiple
        hidden
        onChange={(event) => handleFiles(event.target.files)}
      />

      {photos.length > 0 && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {photos.map((photo, photoIndex) => (
            <li key={photo.id} className="relative aspect-square overflow-hidden rounded-md border">
              <button
                type="button"
                onClick={() => setActiveIndex(photoIndex)}
                aria-label={INTAKE_CONTENT.viewPhoto}
                className="block size-full cursor-pointer"
              >
                <img src={photo.previewUrl} alt="" className="size-full object-cover" />
              </button>
              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                aria-label={INTAKE_CONTENT.removePhoto}
                className="absolute right-1 top-1 cursor-pointer rounded-full bg-background/80 p-1 shadow transition-colors hover:bg-background"
              >
                <X className="size-3.5" />
              </button>
              {photo.warning && (
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-amber-500/90 px-1 py-0.5 text-[10px] leading-tight text-white">
                  {photo.warning}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          void handleFiles(event.dataTransfer.files)
        }}
        disabled={disabled || atLimit || inspecting}
        className={cn(
          'flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-input bg-muted/30 px-4 py-6 text-center transition-colors hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50',
          dragging && 'border-primary bg-primary/5',
        )}
      >
        {inspecting ? (
          <>
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
            <span className="text-sm font-medium">{INTAKE_CONTENT.inspecting}</span>
          </>
        ) : (
          <>
            <ImagePlus className="size-5 text-muted-foreground" />
            <span className="text-sm font-medium">{INTAKE_CONTENT.addPhotos}</span>
            <span className="text-xs text-muted-foreground">{INTAKE_CONTENT.addPhotosHint}</span>
          </>
        )}
      </button>

      <PhotoLightbox
        photos={photos}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </div>
  )
}
