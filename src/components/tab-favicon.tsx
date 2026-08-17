import { useState } from 'react'
import { Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TabFaviconProps {
  src?: string
  className?: string
}

export function TabFavicon({ src, className }: TabFaviconProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return <Globe className={cn('size-3.5 text-muted-foreground', className)} />
  }

  return (
    <img
      src={src}
      alt=""
      className={cn('size-3.5 rounded-[3px] object-contain', className)}
      onError={() => setFailed(true)}
    />
  )
}
