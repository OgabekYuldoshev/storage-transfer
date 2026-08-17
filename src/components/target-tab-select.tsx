import { useState } from 'react'
import { ChevronsUpDown } from 'lucide-react'
import { formatTabLabel } from '@/lib/chrome-storage'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TabFavicon } from '@/components/tab-favicon'

interface TargetTabSelectProps {
  tabs: chrome.tabs.Tab[]
  value: string
  onChange: (tabId: string) => void
}

function hostnameOf(url: string | undefined): string {
  if (!url) return ''
  try {
    const u = new URL(url)
    return `${u.hostname}${u.port ? ':' + u.port : ''}`
  } catch {
    return ''
  }
}

export function TargetTabSelect({ tabs, value, onChange }: TargetTabSelectProps) {
  const [open, setOpen] = useState(false)
  const selectedTab = tabs.find((tab) => String(tab.id) === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between px-2.5 font-normal"
        >
          <span className="flex min-w-0 items-center gap-2">
            {selectedTab ? (
              <>
                <TabFavicon src={selectedTab.favIconUrl} />
                <span className="truncate text-foreground">{formatTabLabel(selectedTab)}</span>
              </>
            ) : (
              <span className="text-muted-foreground">Search destination tab…</span>
            )}
          </span>
          <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search by title or host…" />
          <CommandList>
            <CommandEmpty>No matching tabs.</CommandEmpty>
            <CommandGroup>
              {tabs.map((tab) => {
                const id = String(tab.id)
                const searchValue = `${tab.title ?? ''} ${hostnameOf(tab.url)}`.toLowerCase()
                return (
                  <CommandItem
                    key={id}
                    value={searchValue}
                    data-checked={id === value}
                    onSelect={() => {
                      onChange(id)
                      setOpen(false)
                    }}
                  >
                    <TabFavicon src={tab.favIconUrl} />
                    <span className="min-w-0 flex-1 truncate">{tab.title || 'Untitled'}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {hostnameOf(tab.url)}
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
