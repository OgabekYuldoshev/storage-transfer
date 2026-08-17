import { ArrowRightLeft, CheckCheck, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CurrentTabCard } from '@/components/current-tab-card'
import { StorageTypeToggle } from '@/components/storage-type-toggle'
import { StorageItemsList } from '@/components/storage-items-list'
import { TargetTabSelect } from '@/components/target-tab-select'
import { StatusAlert } from '@/components/status-alert'
import { useStorageTransfer } from '@/hooks/use-storage-transfer'

function App() {
  const {
    currentTab,
    otherTabs,
    activeType,
    entries,
    selectedKeys,
    selectedEntries,
    allSelected,
    targetTabId,
    status,
    isLoadingType,
    isTransferring,
    transferred,
    setTargetTabId,
    loadStorageType,
    toggleEntry,
    toggleSelectAll,
    transfer,
    entryKey,
  } = useStorageTransfer()

  const hasResults = activeType !== null

  return (
    <div className="w-100 bg-background text-foreground">
      <div className="flex items-center gap-2.5 border-b border-border bg-card px-4 py-3.5">
        <img src="/icons/logo_48.png" alt="" className="size-7 rounded-md" />
        <div>
          <h1 className="text-base font-semibold text-foreground">Storage Transfer</h1>
          <p className="text-xs text-muted-foreground">Move storage between browser tabs</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <CurrentTabCard tab={currentTab} />

        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
            Storage type
          </span>
          <StorageTypeToggle value={activeType} disabled={isLoadingType} onChange={loadStorageType} />
        </div>

        {hasResults && (
          <>
            {isLoadingType ? (
              <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card py-8 text-xs text-muted-foreground">
                <RefreshCw className="size-3.5 animate-spin" />
                Loading…
              </div>
            ) : (
              <StorageItemsList
                entries={entries}
                selectedKeys={selectedKeys}
                entryKey={entryKey}
                allSelected={allSelected}
                activeType={activeType}
                onToggle={toggleEntry}
                onToggleAll={toggleSelectAll}
              />
            )}

            <Separator />

            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                Destination tab
              </span>
              <TargetTabSelect tabs={otherTabs} value={targetTabId} onChange={setTargetTabId} />
            </div>

            <Button
              type="button"
              size="lg"
              className="w-full"
              disabled={!targetTabId || selectedEntries.length === 0 || isTransferring || transferred}
              onClick={() => void transfer()}
            >
              {transferred ? (
                <>
                  <CheckCheck /> Transferred
                </>
              ) : isTransferring ? (
                <>
                  <RefreshCw className="animate-spin" /> Transferring…
                </>
              ) : (
                <>
                  <ArrowRightLeft />
                  Transfer{selectedEntries.length > 0 ? ` (${selectedEntries.length})` : ''}
                </>
              )}
            </Button>
          </>
        )}

        {status && <StatusAlert status={status} />}
      </div>
    </div>
  )
}

export default App
