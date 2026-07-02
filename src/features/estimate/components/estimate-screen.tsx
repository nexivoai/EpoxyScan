import { Card, CardContent } from '@/components/ui/card'
import { INTAKE_CONTENT } from '../constants'
import { IntakeForm } from './intake-form'
import { ScanTips } from './scan-tips'

export function EstimateScreen() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">{INTAKE_CONTENT.title}</h1>
        <p className="text-muted-foreground">{INTAKE_CONTENT.subtitle}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5 lg:items-start">
        <aside className="lg:col-span-2">
          <ScanTips />
        </aside>
        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            <IntakeForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
