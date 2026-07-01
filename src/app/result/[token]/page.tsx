import { notFound } from 'next/navigation'
import { ResultView } from '@/features/result/components/result-view'
import { getResultSubmission } from '@/features/result/server/get-result'

export default async function ResultPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const submission = await getResultSubmission(token)
  if (!submission) notFound()

  return <ResultView submission={submission} />
}
