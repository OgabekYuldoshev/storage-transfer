import { Cookie, Database, Timer } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { StorageType } from '@/lib/types'

interface StorageTypeToggleProps {
  value: StorageType | null
  disabled?: boolean
  onChange: (type: StorageType) => void
}

const OPTIONS: { type: StorageType; label: string; icon: typeof Database }[] = [
  { type: 'localStorage', label: 'Local', icon: Database },
  { type: 'sessionStorage', label: 'Session', icon: Timer },
  { type: 'cookies', label: 'Cookies', icon: Cookie },
]

export function StorageTypeToggle({ value, disabled, onChange }: StorageTypeToggleProps) {
  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={value ?? ''}
      onValueChange={(next) => next && onChange(next as StorageType)}
      className="grid w-full grid-cols-3 gap-1.5"
    >
      {OPTIONS.map(({ type, label, icon: Icon }) => (
        <ToggleGroupItem
          key={type}
          value={type}
          disabled={disabled}
          className="gap-1.5 rounded-lg border-border py-3 text-xs font-medium text-muted-foreground data-[state=on]:border-primary/40 data-[state=on]:bg-primary/10 data-[state=on]:text-primary"
        >
          <Icon className="size-3.5" />
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
