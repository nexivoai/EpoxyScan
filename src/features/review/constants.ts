export const APPROVAL_LIMITS = {
  priceMax: 1_000_000,
  notesMax: 2000,
}

export const REVIEW_CONTENT = {
  title: 'Estimate review',
  subtitle: 'Review the AI assessment and approve to send the estimate to the customer.',
  sections: {
    photos: 'Photos',
    customer: 'Customer',
    assessment: 'AI assessment',
    estimate: 'Estimate',
  },
  customer: {
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    requestedFinish: 'Requested finish',
    providedSqft: 'Provided sqft',
    notProvided: 'Not provided',
  },
  assessment: {
    projectType: 'Project type',
    sqftRange: 'Estimated sqft',
    recommendedSystem: 'Recommended system',
    crackSeverity: 'Crack severity',
    complexity: 'Prep complexity',
    imageQuality: 'Image quality',
    confidence: 'Confidence',
    surfaceFlags: 'Surface flags',
    none: 'None',
    unavailable: 'Not available',
  },
  estimate: {
    priceLabel: 'AI estimate',
    blockedLabel: 'Auto-pricing unavailable',
    inspection: 'On-site inspection required',
  },
  verification: {
    heading: 'Flagged for verification',
    notFloorAssessment:
      'These photos do not appear to show a floor, so no AI assessment was generated. Review the photos before pricing.',
  },
  form: {
    title: 'Approve & send',
    priceLow: 'Price low',
    priceHigh: 'Price high',
    priceHint:
      'Leave both blank for inspection or custom quotes (no price is sent to the customer).',
    system: 'System',
    notes: 'Notes (optional)',
    approve: 'Approve & notify customer',
    approving: 'Approving...',
  },
  approved: {
    title: 'Approved',
    body: 'This estimate has been approved and sent to the customer.',
    priceLabel: 'Approved estimate',
    systemLabel: 'System',
    notesLabel: 'Notes',
    inspection: 'No price — customer sees inspection/custom follow-up.',
    resend: 'Resend customer SMS',
    resending: 'Sending...',
  },
  toasts: {
    approvedSent: 'Approved. Customer notified by SMS.',
    approvedNotSent: 'Approved. SMS not sent (sandbox or delivery issue) — use Resend to retry.',
    resendSent: 'Customer SMS sent.',
    resendNotSent: 'SMS not sent (sandbox or delivery issue).',
  },
  errors: {
    approve: 'This submission cannot be approved.',
    resend: 'This submission cannot be notified.',
    generic: 'Something went wrong. Please try again.',
  },
}
