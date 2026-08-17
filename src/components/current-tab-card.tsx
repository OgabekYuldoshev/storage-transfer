import { formatTabLabel } from '@/lib/chrome-storage'
import { TabFavicon } from '@/components/tab-favicon'

interface CurrentTabCardProps {
  tab: chrome.tabs.Tab | null
}

export function CurrentTabCard({ tab }: CurrentTabCardProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
        <TabFavicon src={tab?.favIconUrl} className="size-3.5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
          Source tab
        </div>
        <div className="truncate text-xs font-medium text-foreground">
          {tab ? formatTabLabel(tab) : 'Loading…'}
        </div>
      </div>
    </div>
  )
}
