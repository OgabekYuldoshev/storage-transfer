# 🔄 Storage Transfer

**Developer tool** for transferring localStorage, sessionStorage, and cookies between browser tabs.

> ⚠️ **For Developers Only** - This extension is designed for web developers who need to transfer storage data between different environments (localhost, staging, production) during development and testing.

## ✨ Features

- 📦 Transfer localStorage, sessionStorage, and cookies between tabs
- ✅ Select specific items to transfer
- 🎨 Modern dark theme UI (Catppuccin inspired)
- 🔒 Works only with HTTP/HTTPS tabs
- 🎯 Smart tab sorting (localhost and dev domains prioritized)

## 📥 Installation

1. 📂 Download or clone this repository
2. 🌐 Open Chrome and go to `chrome://extensions/`
3. 🔧 Enable "Developer mode" (toggle top right)
4. 📦 Click "Load unpacked" and select this folder
5. 🎉 Extension icon will appear in toolbar

## 🚀 Usage

1. 🔍 Open the tab with storage data you want to copy
2. 🖱️ Click the extension icon
3. 🎛️ Select storage type (Local, Session, or Cookies)
4. ☑️ Check the items you want to transfer
5. 🎯 Select destination tab from dropdown
6. ✨ Click "Transfer Storage"

## 💡 Common Developer Use Cases

- 🔑 **Copy auth tokens from production to localhost** - Test with real user sessions locally
- 🔄 **Transfer session data between ports** - Move data from `:3000` to `:8080` 
- 🐛 **Debug with production cookies** - Replicate user issues in dev environment
- 🌍 **Multi-environment testing** - Copy storage between staging/dev/prod
- 🎫 **API token management** - Transfer authentication tokens between tabs

## 🔐 Permissions

- 📑 `tabs` - Access browser tabs
- 🍪 `cookies` - Read and write cookies
- 💾 `storage` - Extension storage
- 💉 `scripting` - Inject scripts to read storage data
- 👆 `activeTab` - Access current tab
- 🌐 `<all_urls>` - Access all websites

## 📁 Project Structure

```
storage-transfer/
├── 📄 manifest.json      # Extension configuration
├── 🎨 popup.html         # UI interface
├── ⚙️  popup.js           # Main logic (~470 lines)
├── 🖼️  logo_16.png        # Icon 16x16
├── 🖼️  logo_48.png        # Icon 48x48
├── 🖼️  logo_128.png       # Icon 128x128
└── 📖 README.md          # This file
```

## ⚙️ How It Works

**💾 localStorage/sessionStorage:** 
- 💉 Uses `chrome.scripting.executeScript()` to inject code into source tab
- 📖 Reads all storage items with `localStorage.getItem()` / `sessionStorage.getItem()`
- ✅ User selects specific items to transfer
- 💉 Injects code into destination tab and writes with `setItem()`

**🍪 Cookies:** 
- 📥 Uses `chrome.cookies.getAll()` API to read cookies from source URL
- 🔒 Preserves all attributes: domain, path, secure, httpOnly, sameSite, expiration
- 📤 Uses `chrome.cookies.set()` to write to destination tab

**🎯 Tab Sorting:**
- 🚀 Automatically prioritizes development tabs in dropdown
- 📊 Priority order: `localhost` → `127.0.0.1` → `192.x` → `dev.` domains → others
- ⚡ Makes it faster to select local development targets

## 🌐 Browser Support

- ✅ Chrome 88+
- ✅ Edge 88+ (Chromium)
- ✅ Brave, Opera (should work)

## 🔧 Troubleshooting

- ⚠️ Extension only works on HTTP/HTTPS pages
- ❌ Doesn't work on `chrome://` pages
- ⏳ Both source and destination tabs must be fully loaded

## 🛠️ Development

**🔧 Technologies:**
- ⚡ Manifest V3 (Chrome Extensions API)
- 📝 Vanilla JavaScript (no dependencies, ~470 lines)
- 🎨 HTML/CSS (embedded styles, Catppuccin theme)

**🧩 Key Code Components:**
- 🔄 `loadStorageType()` - Clears previous data, loads only selected type
- 🚀 `transferStorage()` - Handles script injection and cookie API calls
- 📋 `displayStorageItems()` - Renders checkboxes with metadata
- 🎯 Tab sorting algorithm - Prioritizes localhost/dev environments

**🧪 Testing:**
1. ✏️ Edit files (popup.js, popup.html)
2. 🌐 Go to `chrome://extensions/`
3. 🔄 Click refresh icon on extension
4. 🧪 Test between two localhost tabs with different ports
5. 🔍 Use DevTools: Right-click extension → "Inspect popup"

**💡 Debug Tips:**
```javascript
// 🧪 Test localStorage transfer
localStorage.setItem('authToken', 'test123');
localStorage.setItem('userId', '456');

// 🔍 Check console in popup DevTools for errors
```

## 📄 License

MIT License ✨

## 🏷️ Version

**Current version:** 1.0 🎉

