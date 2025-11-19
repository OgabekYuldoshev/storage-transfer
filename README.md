# Storage Transfer

Chrome extension for transferring localStorage, sessionStorage, and cookies between browser tabs.

## Features

- 🔄 **Transfer Storage Data** - Easily transfer localStorage, sessionStorage, and cookies from one tab to another
- 🎯 **Selective Transfer** - Choose specific storage items to transfer
- 🎨 **Minimal UI** - Clean and intuitive interface with dark theme
- ⚡ **Fast & Efficient** - Quick loading and transfer of storage data
- 🔒 **Secure** - Works only with your active tabs

## Installation

### From Source

1. Clone this repository:
```bash
git clone https://github.com/yourusername/storage-transfer.git
cd storage-transfer
```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in the top right)

4. Click "Load unpacked" and select the `storage-transfer` directory

5. The extension icon will appear in your Chrome toolbar

## Usage

1. **Open the extension** by clicking the icon in your Chrome toolbar

2. **Select storage type** to load:
   - Click "Local" to load localStorage
   - Click "Session" to load sessionStorage
   - Click "Cookies" to load cookies

3. **Select items** you want to transfer (use "Select all" for convenience)

4. **Choose destination tab** from the dropdown menu

5. **Click "Transfer Storage"** to complete the transfer

## Permissions

This extension requires the following permissions:

- `tabs` - To access and list browser tabs
- `cookies` - To read and set cookies
- `storage` - To access extension storage
- `scripting` - To inject scripts for reading storage data
- `activeTab` - To access the current active tab
- `<all_urls>` - To access storage data from all websites

## Project Structure

```
storage-transfer/
├── manifest.json      # Extension manifest file
├── popup.html         # Extension popup UI
├── popup.js           # Extension logic and functionality
├── logo_16.png        # Extension icon (16x16)
├── logo_48.png        # Extension icon (48x48)
├── logo_128.png       # Extension icon (128x128)
└── README.md          # This file
```

## Development

### Technologies Used

- **Manifest V3** - Latest Chrome extension API
- **Vanilla JavaScript** - No frameworks, pure JS
- **HTML/CSS** - Modern, minimal UI design

### Code Structure

- `popup.js` - Main extension logic:
  - Tab management
  - Storage data loading (localStorage, sessionStorage, cookies)
  - Data transfer functionality
  - UI state management

- `popup.html` - Extension popup interface:
  - Minimal dark theme design
  - Responsive layout
  - Clean user experience

## Browser Compatibility

- Chrome 88+ (Manifest V3 support required)
- Edge 88+ (Chromium-based)

## License

MIT License - feel free to use and modify as needed.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Issues

If you encounter any issues or have suggestions, please open an issue on GitHub.

## Version

Current version: **1.0**

---

Made with ❤️ for developers who need to transfer storage data between tabs.

