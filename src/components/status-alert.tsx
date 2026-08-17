import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { StatusMessage } from '@/hooks/use-storage-transfer'

export function StatusAlert({ status }: { status: StatusMessage }) {
  const isSuccess = status.variant === 'success'

  return (
    <Alert
      variant={isSuccess ? 'default' : 'destructive'}
      className={isSuccess ? 'border-primary/30 bg-primary/5' : undefined}
    >
      {isSuccess ? <CheckCircle2 className="text-primary" /> : <AlertCircle />}
      <AlertDescription className={isSuccess ? 'text-foreground' : undefined}>
        {status.message}
      </AlertDescription>
    </Alert>
  )
}
