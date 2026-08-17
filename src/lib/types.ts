export type StorageType = 'localStorage' | 'sessionStorage' | 'cookies'

export type StorageEntryType = 'localStorage' | 'sessionStorage' | 'cookie'

export interface StorageEntry {
  type: StorageEntryType
  key: string
  value: string
  cookie?: chrome.cookies.Cookie
}

export interface StorageData {
  localStorage?: Record<string, string>
  sessionStorage?: Record<string, string>
  cookies?: chrome.cookies.Cookie[]
}
