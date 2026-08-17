import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  formatTabLabel,
  getCurrentTab,
  getOtherTabs,
  readCookies,
  readLocalStorage,
  readSessionStorage,
  transferEntries,
} from '@/lib/chrome-storage'
import type { StorageData, StorageEntry, StorageType } from '@/lib/types'

export interface StatusMessage {
  message: string
  variant: 'success' | 'error'
}

function entryKey(entry: Pick<StorageEntry, 'type' | 'key'>): string {
  return `${entry.type}:${entry.key}`
}

function buildEntries(data: StorageData): StorageEntry[] {
  const entries: StorageEntry[] = []

  if (data.localStorage) {
    for (const [key, value] of Object.entries(data.localStorage)) {
      entries.push({ type: 'localStorage', key, value })
    }
  }
  if (data.sessionStorage) {
    for (const [key, value] of Object.entries(data.sessionStorage)) {
      entries.push({ type: 'sessionStorage', key, value })
    }
  }
  if (data.cookies) {
    for (const cookie of data.cookies) {
      entries.push({ type: 'cookie', key: cookie.name, value: cookie.value, cookie })
    }
  }

  return entries
}

export function useStorageTransfer() {
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null)
  const [otherTabs, setOtherTabs] = useState<chrome.tabs.Tab[]>([])
  const [activeType, setActiveType] = useState<StorageType | null>(null)
  const [storageData, setStorageData] = useState<StorageData>({})
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set())
  const [targetTabId, setTargetTabId] = useState<string>('')
  const [status, setStatus] = useState<StatusMessage | null>(null)
  const [isLoadingType, setIsLoadingType] = useState(false)
  const [isTransferring, setIsTransferring] = useState(false)
  const [transferred, setTransferred] = useState(false)

  useEffect(() => {
    void (async () => {
      const tab = await getCurrentTab()
      setCurrentTab(tab)
      if (tab?.id !== undefined) {
        setOtherTabs(await getOtherTabs(tab.id))
      }
    })()
  }, [])

  const entries = useMemo(() => buildEntries(storageData), [storageData])

  const loadStorageType = useCallback(
    async (type: StorageType) => {
      if (!currentTab?.id) {
        setStatus({ message: 'Current tab not available', variant: 'error' })
        return
      }

      setIsLoadingType(true)
      setActiveType(type)
      setSelectedKeys(new Set())
      setTransferred(false)

      try {
        let data: StorageData = {}

        if (type === 'localStorage') {
          const result = await readLocalStorage(currentTab.id)
          data = { localStorage: Object.keys(result).length > 0 ? result : undefined }
        } else if (type === 'sessionStorage') {
          const result = await readSessionStorage(currentTab.id)
          data = { sessionStorage: Object.keys(result).length > 0 ? result : undefined }
        } else if (currentTab.url) {
          const cookies = await readCookies(currentTab.url)
          data = { cookies: cookies.length > 0 ? cookies : undefined }
        }

        setStorageData(data)
        const count = buildEntries(data).length
        setStatus({
          message: count > 0 ? `${count} item${count === 1 ? '' : 's'} found` : 'No items found',
          variant: 'success',
        })
      } catch (error) {
        setStatus({ message: `Error: ${(error as Error).message}`, variant: 'error' })
      } finally {
        setIsLoadingType(false)
      }
    },
    [currentTab],
  )

  const toggleEntry = useCallback((entry: StorageEntry, checked: boolean) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev)
      const key = entryKey(entry)
      if (checked) next.add(key)
      else next.delete(key)
      return next
    })
  }, [])

  const allSelected = entries.length > 0 && selectedKeys.size === entries.length

  const toggleSelectAll = useCallback(() => {
    setSelectedKeys(allSelected ? new Set() : new Set(entries.map(entryKey)))
  }, [allSelected, entries])

  const selectedEntries = useMemo(
    () => entries.filter((entry) => selectedKeys.has(entryKey(entry))),
    [entries, selectedKeys],
  )

  const transfer = useCallback(async () => {
    const targetTab = otherTabs.find((tab) => String(tab.id) === targetTabId)

    if (selectedEntries.length === 0) {
      setStatus({ message: 'Select items to transfer', variant: 'error' })
      return
    }
    if (!targetTab?.id || !targetTab.url) {
      setStatus({ message: 'Target tab not found or invalid', variant: 'error' })
      return
    }

    setIsTransferring(true)
    try {
      await transferEntries(targetTab.id, targetTab.url, selectedEntries)
      setStatus({
        message: `${selectedEntries.length} item${selectedEntries.length === 1 ? '' : 's'} transferred successfully`,
        variant: 'success',
      })
      setTransferred(true)
    } catch (error) {
      setStatus({ message: `Error: ${(error as Error).message}`, variant: 'error' })
    } finally {
      setIsTransferring(false)
    }
  }, [otherTabs, selectedEntries, targetTabId])

  return {
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
    formatTabLabel,
    entryKey,
  }
}
