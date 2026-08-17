import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { StorageEntry, StorageType } from '@/lib/types'

interface StorageItemsListProps {
  entries: StorageEntry[]
  selectedKeys: Set<string>
  entryKey: (entry: Pick<StorageEntry, 'type' | 'key'>) => string
  allSelected: boolean
  activeType: StorageType | null
  onToggle: (entry: StorageEntry, checked: boolean) => void
  onToggleAll: () => void
}

const GROUP_LABEL: Record<StorageEntry['type'], string> = {
  localStorage: 'localStorage',
  sessionStorage: 'sessionStorage',
  cookie: 'Cookies',
}

const EMPTY_LABEL: Record<StorageType, string> = {
  localStorage: 'No localStorage items on this tab',
  sessionStorage: 'No sessionStorage items on this tab',
  cookies: 'No cookies found for this tab',
}

export function StorageItemsList({
  entries,
  selectedKeys,
  entryKey,
  allSelected,
  activeType,
  onToggle,
  onToggleAll,
}: StorageItemsListProps) {
  let lastType: StorageEntry['type'] | null = null

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
        <span className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
          Select items
          {selectedKeys.size > 0 && (
            <Badge variant="secondary" className="h-4 px-1.5 text-[10px] font-semibold normal-case">
              {selectedKeys.size}
            </Badge>
          )}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-[11px] text-primary hover:text-primary"
          onClick={onToggleAll}
          disabled={entries.length === 0}
        >
          {allSelected ? 'Deselect all' : 'Select all'}
        </Button>
      </div>

      {entries.length === 0 ? (
        <p className="px-3 py-6 text-center text-xs text-muted-foreground">
          {activeType ? EMPTY_LABEL[activeType] : 'No storage items found'}
        </p>
      ) : (
        <ScrollArea className="h-[200px]">
          <div>
            {entries.map((entry) => {
              const key = entryKey(entry)
              const showHeader = entry.type !== lastType
              lastType = entry.type

              return (
                <div key={key}>
                  {showHeader && (
                    <div className="bg-muted/30 px-3 pt-2.5 pb-1.5 text-[9px] font-semibold tracking-wide text-muted-foreground uppercase">
                      {GROUP_LABEL[entry.type]}
                    </div>
                  )}
                  <label className="flex cursor-pointer items-start gap-2.5 border-b border-border px-3 py-2.5 last:border-b-0 hover:bg-accent/50">
                    <Checkbox
                      className="mt-0.5"
                      checked={selectedKeys.has(key)}
                      onCheckedChange={(checked) => onToggle(entry, checked === true)}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-medium text-foreground">{entry.key}</div>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className="text-[9px] font-semibold tracking-wide text-muted-foreground uppercase">
                          {entry.type}
                        </span>
                        <span className="truncate text-[10px] text-muted-foreground">{entry.value}</span>
                      </div>
                    </div>
                  </label>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
