export interface UploadedPhoto {
  url: string
  pathname: string
  contentType: string
  bytes: number
  width: number | null
  height: number | null
}

export interface DraftPhoto {
  id: string
  file: File
  previewUrl: string
  width: number | null
  height: number | null
  warning: string | null
}
