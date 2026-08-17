# Privacy Policy — Storage Transfer

_Last updated: 2026-08-17_

Storage Transfer is a browser extension that copies `localStorage`,
`sessionStorage`, and cookie values from one browser tab you select to
another browser tab you select.

## Data collection

Storage Transfer does not collect, store, or transmit any data.

- It does not use analytics, telemetry, or crash reporting.
- It does not send any data to a remote server. There is no backend.
- It does not persist any data beyond the current popup session — storage
  data is only held in memory while the popup is open, and is discarded when
  the popup closes.

## What the extension accesses, and why

| Data | Access | Purpose |
|---|---|---|
| `localStorage` / `sessionStorage` of the source tab | Read, only when you click a storage type button | Displayed in the popup so you can choose what to transfer |
| Cookies of the source tab's site | Read via `chrome.cookies.getAll()`, only when you click "Cookies" | Displayed in the popup so you can choose what to transfer |
| `localStorage` / `sessionStorage` / cookies of the destination tab's site | Written, only for the items you selected and only after you click "Transfer" | Performs the transfer you requested |
| Open tabs' titles/URLs/favicons | Read via `chrome.tabs.query()` | Populates the source tab display and the destination tab picker |

All of this happens locally, directly between your browser and the tabs you
explicitly select. Nothing leaves your machine.

## Permissions

See `store/listing.md` in this repository for a full justification of each
permission the extension requests (`cookies`, `scripting`, and host access).

## Changes to this policy

If this policy changes, the update will be reflected in this file and in the
extension's Chrome Web Store listing.

## Contact

Questions about this policy can be filed as an issue on the project's GitHub
repository.
