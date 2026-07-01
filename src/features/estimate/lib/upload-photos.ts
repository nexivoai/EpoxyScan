import { upload } from '@vercel/blob/client'
import { BLOB_UPLOAD_ROUTE } from '@/constants/upload'
import type { DraftPhoto, UploadedPhoto } from '../types'

export async function uploadPhotos(
  photos: DraftPhoto[],
  uploaded: Map<string, UploadedPhoto>,
): Promise<UploadedPhoto[]> {
  return Promise.all(
    photos.map(async (photo) => {
      const cached = uploaded.get(photo.id)
      if (cached) return cached

      const blob = await upload(photo.file.name, photo.file, {
        access: 'public',
        handleUploadUrl: BLOB_UPLOAD_ROUTE,
      })

      const result: UploadedPhoto = {
        url: blob.url,
        pathname: blob.pathname,
        contentType: photo.file.type,
        bytes: photo.file.size,
        width: photo.width,
        height: photo.height,
      }
      uploaded.set(photo.id, result)
      return result
    }),
  )
}
