import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from '@/constants/upload'

export const PHOTO_LIMITS = {
  minCount: 2,
  maxCount: 10,
  minBytes: 30 * 1024,
  maxBytes: MAX_UPLOAD_BYTES,
  minDimension: 1000,
  acceptedTypes: ALLOWED_IMAGE_TYPES,
}

export const SQFT_LIMITS = { min: 50, max: 100000 }

export const SCAN_TIPS = {
  title: 'Tips for the Best Scan Results',
  items: [
    'Use bright lighting',
    'Capture the entire floor',
    'Take the widest photo possible',
    'Keep the camera steady',
    'Remove tools, boxes, and debris',
    'Avoid shadows and reflections',
    'Make sure the floor is dry',
  ],
  footer: 'Upload only clear photos.',
}

export const PHOTO_RECOMMENDATION = 'Upload 2–4 photos from different angles for higher accuracy.'

export const PHOTO_EXAMPLES = {
  title: 'Good vs. bad photos',
  goodLabel: 'Good',
  badLabel: 'Bad',
  good: [
    { src: '/examples/good-lighting.svg', caption: 'Whole floor, bright and evenly lit' },
    { src: '/examples/good-wide.svg', caption: 'Wide angle from a corner' },
    { src: '/examples/good-sharp.svg', caption: 'Sharp, in-focus surface detail' },
  ],
  bad: [
    { src: '/examples/bad-dark.svg', caption: 'Dark photo or heavy shadows' },
    { src: '/examples/bad-clutter.svg', caption: 'Clutter, boxes, or tools on the floor' },
    { src: '/examples/bad-blurry.svg', caption: 'Blurry or too close to the surface' },
  ],
}

export const INTAKE_CONTENT = {
  title: 'Get your estimate',
  subtitle:
    'Add photos of your floor and a few details, and we’ll text you a preliminary estimate.',
  photosLabel: 'Floor photos',
  addPhotos: 'Add photos',
  addPhotosHint: 'Click to browse or drag & drop',
  inspecting: 'Checking photos…',
  removePhoto: 'Remove photo',
  viewPhoto: 'View photo',
  prevPhoto: 'Previous photo',
  nextPhoto: 'Next photo',
  photoPreviewTitle: 'Photo preview',
  examplesCta: 'See good vs. bad examples',
  fields: {
    name: { label: 'Full name', placeholder: 'Jane Doe' },
    phone: { label: 'Phone', placeholder: '+1 555 123 4567' },
    email: { label: 'Email', placeholder: 'jane@example.com' },
    sqft: { label: 'Approx. square footage (optional)', placeholder: 'e.g. 500' },
    finish: { label: 'Preferred finish', placeholder: 'Select a finish' },
  },
  submit: 'Submit for estimate',
  submitting: 'Submitting…',
  submitAnother: 'Submit another estimate',
  errors: {
    upload: 'We couldn’t upload your photos. Please try again.',
    submit: 'Something went wrong. Please try again.',
  },
  success: {
    title: 'Submission received',
    body: 'Thanks! We’re analyzing your photos and will text you a preliminary estimate shortly.',
  },
}
