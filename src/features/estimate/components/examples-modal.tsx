'use client'

import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { INTAKE_CONTENT, PHOTO_EXAMPLES, PHOTO_RECOMMENDATION } from '../constants'

function ExampleColumn({
  tone,
  items,
}: {
  tone: 'good' | 'bad'
  items: readonly { src: string; caption: string }[]
}) {
  const isGood = tone === 'good'
  const Icon = isGood ? Check : X
  return (
    <div className="flex flex-col gap-2">
      <p
        className={cn(
          'flex items-center gap-1.5 text-sm font-medium',
          isGood ? 'text-primary' : 'text-destructive',
        )}
      >
        <Icon className="size-4" />
        {isGood ? PHOTO_EXAMPLES.goodLabel : PHOTO_EXAMPLES.badLabel}
      </p>
      {items.map((item) => (
        <div key={item.src} className="flex flex-col gap-1">
          <img
            src={item.src}
            alt=""
            className="aspect-video w-full rounded-md border object-cover"
          />
          <p className="text-xs text-muted-foreground">{item.caption}</p>
        </div>
      ))}
    </div>
  )
}

export function ExamplesModal() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        {INTAKE_CONTENT.examplesCta}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{PHOTO_EXAMPLES.title}</DialogTitle>
          <DialogDescription>{PHOTO_RECOMMENDATION}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <ExampleColumn tone="good" items={PHOTO_EXAMPLES.good} />
          <ExampleColumn tone="bad" items={PHOTO_EXAMPLES.bad} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
