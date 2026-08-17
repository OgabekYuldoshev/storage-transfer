import type { StorageEntry } from '@/lib/types'

export async function getCurrentTab(): Promise<chrome.tabs.Tab | null> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return tab ?? null
}

function tabPriority(url: string | undefined): number {
  if (!url) return 99
  if (url.startsWith('http://localhost')) return 0
  if (url.startsWith('http://127.0.0.1')) return 1
  if (url.startsWith('http://192.')) return 2
  if (url.startsWith('http://dev')) return 3
  if (url.startsWith('https://dev')) return 4
  return 5
}

export async function getOtherTabs(currentTabId: number): Promise<chrome.tabs.Tab[]> {
  const allTabs = await chrome.tabs.query({})
  const tabs = allTabs.filter(
    (tab) => tab.id !== currentTabId && tab.url && tab.url.startsWith('http'),
  )
  return tabs.sort((a, b) => tabPriority(a.url) - tabPriority(b.url))
}

export async function readLocalStorage(tabId: number): Promise<Record<string, string>> {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const data: Record<string, string> = {}
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key !== null) data[key] = localStorage.getItem(key) ?? ''
      }
      return data
    },
  })
  return results[0]?.result ?? {}
}

export async function readSessionStorage(tabId: number): Promise<Record<string, string>> {
  const results = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const data: Record<string, string> = {}
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key !== null) data[key] = sessionStorage.getItem(key) ?? ''
      }
      return data
    },
  })
  return results[0]?.result ?? {}
}

export async function readCookies(url: string): Promise<chrome.cookies.Cookie[]> {
  try {
    return await chrome.cookies.getAll({ url })
  } catch (error) {
    console.warn('Failed to get cookies:', error)
    return []
  }
}

export async function transferEntries(
  targetTabId: number,
  targetTabUrl: string,
  entries: StorageEntry[],
): Promise<void> {
  const localItems = entries.filter((item) => item.type === 'localStorage')
  const sessionItems = entries.filter((item) => item.type === 'sessionStorage')
  const cookieItems = entries.filter((item) => item.type === 'cookie')

  if (localItems.length > 0 || sessionItems.length > 0) {
    await chrome.scripting.executeScript({
      target: { tabId: targetTabId },
      func: (local: { key: string; value: string }[], session: { key: string; value: string }[]) => {
        local.forEach((item) => localStorage.setItem(item.key, item.value))
        session.forEach((item) => sessionStorage.setItem(item.key, item.value))
      },
      args: [
        localItems.map((item) => ({ key: item.key, value: item.value })),
        sessionItems.map((item) => ({ key: item.key, value: item.value })),
      ],
    })
  }

  if (cookieItems.length > 0) {
    const targetOrigin = new URL(targetTabUrl).origin

    for (const item of cookieItems) {
      const cookie = item.cookie
      if (!cookie) continue

      try {
        await chrome.cookies.set({
          url: targetOrigin,
          name: cookie.name,
          value: cookie.value,
          domain: cookie.domain,
          path: cookie.path,
          secure: cookie.secure,
          httpOnly: cookie.httpOnly,
          sameSite: cookie.sameSite,
          expirationDate: cookie.expirationDate,
        })
      } catch (error) {
        console.warn('Failed to set cookie:', cookie.name, error)
      }
    }
  }
}

export function formatTabLabel(tab: chrome.tabs.Tab): string {
  if (!tab.url) return tab.title || 'Untitled'
  try {
    const url = new URL(tab.url)
    const title = tab.title ? tab.title.substring(0, 50) : 'Untitled'
    return `${title} (${url.hostname}${url.port ? ':' + url.port : ''})`
  } catch {
    return tab.title || 'Untitled'
  }
}
