import { notFound } from 'next/navigation'
import { ReviewScreen } from '@/features/review/components/review-screen'
import { getReviewSubmission } from '@/features/review/server/get-submission'

export default async function ReviewPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const data = await getReviewSubmission(token)
  if (!data) notFound()

  return <ReviewScreen submission={data.submission} photos={data.photos} />
}
