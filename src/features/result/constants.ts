export const RESULT_CONTENT = {
  title: 'Your epoxy floor estimate',
  approved: {
    estimateLabel: 'Estimated price range',
    systemLabel: 'Recommended system',
    body: 'This range is based on the photos and details you shared.',
  },
  inspection: {
    title: 'On-site visit needed',
    body: 'Based on your photos, your project needs a quick on-site inspection before we can share a price. A contractor will reach out to schedule it.',
  },
  notFloor: {
    title: 'We could not read a floor in your photos',
    body: 'These photos did not look like a floor, so we could not prepare an estimate. Please start a new request with clear photos of the floor area.',
  },
  pending: {
    title: 'Almost there',
    body: 'Your estimate is being finalized. We will text you as soon as it is ready.',
  },
}
