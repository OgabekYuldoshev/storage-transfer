# Chrome Web Store listing copy

Paste these directly into the Developer Dashboard. Plain text only — the
dashboard fields don't render markdown.

## Store listing tab

**Extension name**
Storage Transfer

**Summary** (132 characters max)
```
Transfer localStorage, sessionStorage and cookies between browser tabs for local, staging and production testing.
```
(115 characters)

**Category**
Developer Tools

**Language**
English

**Description**
```
Storage Transfer moves localStorage, sessionStorage, and cookies from one browser tab to another — without opening DevTools or copy-pasting values by hand.

Built for developers who juggle local, staging, and production environments and need to reproduce a session, an auth token, or a feature flag in a different tab.

HOW IT WORKS
1. Open the tab that has the storage data you want to copy.
2. Click the Storage Transfer icon.
3. Choose a storage type: Local, Session, or Cookies.
4. Select exactly which items to transfer.
5. Search for and pick a destination tab.
6. Click Transfer.

FEATURES
• Transfer localStorage, sessionStorage, and cookies independently or together
• Item-level selection — copy only what you need, nothing extra
• Searchable destination picker with tab favicons
• Cookies are transferred with every attribute intact: domain, path, secure, httpOnly, sameSite, and expiration
• Destination tabs are sorted with localhost and dev domains first
• Works with any HTTP/HTTPS tab

COMMON USE CASES
• Copy an auth token from production to localhost to test with a real session
• Move session data between local ports, e.g. :3000 to :8080
• Reproduce a user-reported bug locally using their (anonymized) cookies
• Sync storage across staging, dev, and production tabs while testing

PRIVACY
Storage Transfer does not collect, store, or transmit any data. Everything happens locally in your browser: it reads storage from the source tab you choose and writes it to the destination tab you choose, using Chrome's own APIs. No analytics, no telemetry, no remote servers.

PERMISSIONS
• cookies — read cookies from the source tab and write them to the destination tab
• scripting — inject a short script to read localStorage/sessionStorage in the source tab and write it in the destination tab (this is the core transfer mechanism)
• host access (all sites) — required so the extension can run on whatever site you're developing against, since source and destination tabs are often on different domains
```

## Privacy practices tab

**Single purpose description**
```
Storage Transfer lets a developer copy localStorage, sessionStorage, and cookie values from one open browser tab to another open browser tab that they explicitly select.
```

**Permission justifications**

| Permission | Justification |
|---|---|
| `cookies` | Reads cookies from the source tab's site via `chrome.cookies.getAll()` and writes the user-selected cookies to the destination tab's site via `chrome.cookies.set()`, preserving domain/path/secure/httpOnly/sameSite/expirationDate. |
| `scripting` | Injects a small function into the source tab to read `localStorage`/`sessionStorage`, and into the destination tab to write the user-selected values. This is the only way to access page storage from an extension popup. |
| Host permission `<all_urls>` | The user picks arbitrary source and destination tabs that are frequently on different domains (e.g. production vs. localhost). Both `scripting` and `cookies` need host access to the specific sites involved, and those sites aren't known ahead of time. |

**Are you using remote code?**
No.

**Data usage**
Storage Transfer does not collect or transmit any user data to any server. All reads/writes happen directly between the browser and the tabs the user selects, via Chrome's extension APIs. No analytics or tracking of any kind.

**Privacy policy URL**
See `store/PRIVACY.md` in this repo — host it (e.g. GitHub Pages, a gist, or any static page) and paste that URL into the dashboard. The Chrome Web Store requires a reachable privacy policy URL for extensions requesting broad host permissions, even when no data is actually collected.

## Assets checklist

- [x] Icon 128×128 — pulled automatically from `manifest.json` (`public/icons/logo_128.png`)
- [x] Screenshots (1280×800) — `store/screenshots/1-overview.png` … `4-transferred.png`
- [x] Small promo tile (440×280) — `store/promo-tile-440x280.png`
- [ ] Marquee promo tile (1400×560) — optional, not included
- [ ] Privacy policy hosted and linked — see `store/PRIVACY.md`

## Packaging

```bash
bun run build
cd dist && zip -r ../storage-transfer.zip . -x ".*" && cd ..
```

Upload `storage-transfer.zip` in the Developer Dashboard under "Package".
