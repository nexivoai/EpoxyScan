import { PHOTO_LIMITS } from '../constants'

export interface FileCheck {
  blocked: boolean
  warning: string | null
  width: number | null
  height: number | null
}

export function isAcceptedType(file: File): boolean {
  return PHOTO_LIMITS.acceptedTypes.includes(file.type)
}

export async function readImageSize(file: File): Promise<{ width: number; height: number } | null> {
  try {
    const bitmap = await createImageBitmap(file)
    const size = { width: bitmap.width, height: bitmap.height }
    bitmap.close()
    return size
  } catch {
    return null
  }
}

export async function inspectFile(file: File): Promise<FileCheck> {
  if (!isAcceptedType(file)) {
    return { blocked: true, warning: 'Unsupported file type', width: null, height: null }
  }
  if (file.size > PHOTO_LIMITS.maxBytes) {
    return { blocked: true, warning: 'File is too large', width: null, height: null }
  }
  if (file.size < PHOTO_LIMITS.minBytes) {
    return {
      blocked: true,
      warning: 'Image looks too small or low quality',
      width: null,
      height: null,
    }
  }

  const size = await readImageSize(file)
  const tooSmall = size !== null && Math.max(size.width, size.height) < PHOTO_LIMITS.minDimension

  return {
    blocked: false,
    warning: tooSmall ? 'Low resolution — a sharper photo improves accuracy' : null,
    width: size?.width ?? null,
    height: size?.height ?? null,
  }
}

export function countError(count: number): string | null {
  if (count < PHOTO_LIMITS.minCount)
    return `Add at least ${PHOTO_LIMITS.minCount} photos to continue`
  if (count > PHOTO_LIMITS.maxCount) return `You can upload up to ${PHOTO_LIMITS.maxCount} photos`
  return null
}
