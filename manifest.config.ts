import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json' with { type: 'json' }

export default defineManifest({
  manifest_version: 3,
  name: 'Storage Transfer',
  description: 'Transfer localStorage, sessionStorage and cookies between tabs',
  version: pkg.version,
  icons: {
    16: 'icons/logo_16.png',
    48: 'icons/logo_48.png',
    128: 'icons/logo_128.png',
  },
  action: {
    default_popup: 'index.html',
    default_icon: {
      16: 'icons/logo_16.png',
      48: 'icons/logo_48.png',
      128: 'icons/logo_128.png',
    },
  },
  // 'tabs' and 'activeTab' are unnecessary: host_permissions already grants
  // full tab metadata (url/title/favIconUrl) for the http(s) tabs this
  // extension actually reads, per Chrome's permission model.
  permissions: ['cookies', 'scripting'],
  host_permissions: ['<all_urls>'],
})
