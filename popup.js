let currentTab = null;
let tabs = [];
let storageData = {};
let selectedItems = [];

// Storage types constants
const STORAGE_TYPES = {
  LOCAL: 'localStorage',
  SESSION: 'sessionStorage',
  COOKIES: 'cookies'
};

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
  await initializePopup();
  setupEventListeners();
});

// Initialize popup data
async function initializePopup() {
  await loadCurrentTab();
  await loadOtherTabs();
}

// Setup event listeners
function setupEventListeners() {
  document.getElementById('loadLocalStorage').addEventListener('click', () => loadStorageType(STORAGE_TYPES.LOCAL));
  document.getElementById('loadSessionStorage').addEventListener('click', () => loadStorageType(STORAGE_TYPES.SESSION));
  document.getElementById('loadCookies').addEventListener('click', () => loadStorageType(STORAGE_TYPES.COOKIES));
  document.getElementById('selectAll').addEventListener('click', toggleSelectAll);
  document.getElementById('targetTab').addEventListener('change', handleTargetTabChange);
  document.getElementById('transferBtn').addEventListener('click', transferStorage);
}

// Load current tab information
async function loadCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab;
  
  if (!tab || !tab.url) {
    document.getElementById('currentTabInfo').textContent = 'Unable to load tab info';
    return;
  }
  
  try {
    const url = new URL(tab.url);
    document.getElementById('currentTabInfo').textContent = `${tab.title || 'Untitled'} (${url.hostname})`;
  } catch (error) {
    document.getElementById('currentTabInfo').textContent = tab.title || 'Current tab';
  }
}

// Load other tabs for destination selection
async function loadOtherTabs() {
  if (!currentTab) {
    return;
  }
  
  const allTabs = await chrome.tabs.query({});
  tabs = allTabs.filter(tab => 
    tab.id !== currentTab.id && 
    tab.url && 
    !tab.url.startsWith('chrome://') &&
    !tab.url.startsWith('chrome-extension://')
  );
  
  const targetSelect = document.getElementById('targetTab');
  tabs.forEach(tab => {
    try {
      const url = new URL(tab.url);
      const title = tab.title ? tab.title.substring(0, 50) : 'Untitled';
      const option = new Option(
        `${title}... (${url.hostname})`,
        tab.id
      );
      targetSelect.add(option);
    } catch (error) {
      console.warn('Skipping tab with invalid URL:', tab.url);
    }
  });
}

// Load specific storage type
async function loadStorageType(storageType) {
  if (!currentTab || !currentTab.id) {
    showStatus('Current tab not available', 'error');
    return;
  }

  try {
    // Clear all storage data first
    clearAllStorageData();
    
    // Update button states - only clicked button should be active
    updateButtonState(storageType);
    
    // Initialize storage data
    storageData = {};

    // Load only the selected storage type
    switch (storageType) {
      case STORAGE_TYPES.LOCAL:
        await loadLocalStorage();
        break;
      case STORAGE_TYPES.SESSION:
        await loadSessionStorage();
        break;
      case STORAGE_TYPES.COOKIES:
        await loadCookies();
        break;
    }

    displayStorageItems();
    showStorageSections();
    showStatus(`${getTotalItemsCount()} ta element topildi`, 'success');
    
  } catch (error) {
    showStatus('Error: ' + error.message, 'error');
    console.error(error);
  }
}

// Clear all storage data
function clearAllStorageData() {
  storageData = {};
  selectedItems = [];
}

// Update button active state - only clicked button is active
function updateButtonState(activeStorageType) {
  const buttons = {
    [STORAGE_TYPES.LOCAL]: document.getElementById('loadLocalStorage'),
    [STORAGE_TYPES.SESSION]: document.getElementById('loadSessionStorage'),
    [STORAGE_TYPES.COOKIES]: document.getElementById('loadCookies')
  };

  // Remove active state from all buttons
  Object.values(buttons).forEach(button => {
    if (button) {
      button.classList.remove('active');
    }
  });

  // Add active state only to clicked button
  const activeButton = buttons[activeStorageType];
  if (activeButton) {
    activeButton.classList.add('active');
  }
}

// Load localStorage
async function loadLocalStorage() {
  // Clear other storage types
  storageData.sessionStorage = undefined;
  storageData.cookies = undefined;
  
  const results = await chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    func: () => {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        data[key] = localStorage.getItem(key);
      }
      return data;
    }
  });

  if (results[0].result && Object.keys(results[0].result).length > 0) {
    storageData.localStorage = results[0].result;
  } else {
    storageData.localStorage = undefined;
  }
}

// Load sessionStorage
async function loadSessionStorage() {
  // Clear other storage types
  storageData.localStorage = undefined;
  storageData.cookies = undefined;
  
  const results = await chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    func: () => {
      const data = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        data[key] = sessionStorage.getItem(key);
      }
      return data;
    }
  });

  if (results[0].result && Object.keys(results[0].result).length > 0) {
    storageData.sessionStorage = results[0].result;
  } else {
    storageData.sessionStorage = undefined;
  }
}

// Load cookies
async function loadCookies() {
  // Clear other storage types
  storageData.localStorage = undefined;
  storageData.sessionStorage = undefined;
  
  if (!currentTab.url) {
    storageData.cookies = undefined;
    return;
  }

  try {
    const cookies = await chrome.cookies.getAll({ url: currentTab.url });
    storageData.cookies = cookies && cookies.length > 0 ? cookies : undefined;
  } catch (error) {
    console.warn('Failed to get cookies:', error);
    storageData.cookies = undefined;
  }
}

// Show storage sections
function showStorageSections() {
  document.getElementById('storageItemsSection').classList.remove('hidden');
  document.getElementById('targetTabSection').classList.remove('hidden');
  document.getElementById('transferBtn').classList.remove('hidden');
}

// Get total items count
function getTotalItemsCount() {
  let count = 0;
  if (storageData.localStorage) count += Object.keys(storageData.localStorage).length;
  if (storageData.sessionStorage) count += Object.keys(storageData.sessionStorage).length;
  if (storageData.cookies) count += storageData.cookies.length;
  return count;
}

// Display storage items
function displayStorageItems() {
  const container = document.getElementById('storageItems');
  container.innerHTML = '';
  selectedItems = [];

  // Display localStorage
  if (storageData.localStorage && Object.keys(storageData.localStorage).length > 0) {
    const localHeader = document.createElement('div');
    localHeader.className = 'storage-category-header';
    localHeader.textContent = 'localStorage';
    container.appendChild(localHeader);
    
    Object.keys(storageData.localStorage).forEach(key => {
      container.appendChild(createStorageItem('localStorage', key, storageData.localStorage[key]));
    });
  }

  // Display sessionStorage
  if (storageData.sessionStorage && Object.keys(storageData.sessionStorage).length > 0) {
    const sessionHeader = document.createElement('div');
    sessionHeader.className = 'storage-category-header';
    sessionHeader.textContent = 'sessionStorage';
    container.appendChild(sessionHeader);
    
    Object.keys(storageData.sessionStorage).forEach(key => {
      container.appendChild(createStorageItem('sessionStorage', key, storageData.sessionStorage[key]));
    });
  }

  // Display cookies
  if (storageData.cookies && storageData.cookies.length > 0) {
    const cookieHeader = document.createElement('div');
    cookieHeader.className = 'storage-category-header';
    cookieHeader.textContent = 'Cookies';
    container.appendChild(cookieHeader);
    
    storageData.cookies.forEach(cookie => {
      container.appendChild(createStorageItem('cookie', cookie.name, cookie.value, cookie));
    });
  }

  if (container.children.length === 0) {
    container.innerHTML = '<p class="empty-state">No storage items found</p>';
  }
}

// Create storage item element
function createStorageItem(type, key, value, fullData = null) {
  const div = document.createElement('label');
  div.className = 'storage-item';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'storage-checkbox';
  checkbox.addEventListener('change', (e) => {
    if (e.target.checked) {
      selectedItems.push({ type, key, value, fullData });
    } else {
      selectedItems = selectedItems.filter(item => !(item.type === type && item.key === key));
    }
    updateSelectAllButton();
  });
  
  const content = document.createElement('div');
  content.className = 'storage-item-content';
  
  const keyDiv = document.createElement('div');
  keyDiv.className = 'storage-item-key';
  keyDiv.textContent = key || '';
  
  const metaDiv = document.createElement('div');
  metaDiv.className = 'storage-item-meta';
  
  const typeDiv = document.createElement('div');
  typeDiv.className = 'storage-item-type';
  typeDiv.textContent = type;
  
  const valueDiv = document.createElement('div');
  valueDiv.className = 'storage-item-value';
  const valueStr = value != null ? String(value) : '';
  const displayValue = valueStr.substring(0, 60) + (valueStr.length > 60 ? '...' : '');
  valueDiv.textContent = displayValue;
  
  metaDiv.appendChild(typeDiv);
  metaDiv.appendChild(valueDiv);
  content.appendChild(keyDiv);
  content.appendChild(metaDiv);
  
  div.appendChild(checkbox);
  div.appendChild(content);
  return div;
}

// Toggle select all items
function toggleSelectAll() {
  const checkboxes = document.querySelectorAll('.storage-checkbox');
  const allChecked = Array.from(checkboxes).every(cb => cb.checked);
  
  checkboxes.forEach(cb => {
    cb.checked = !allChecked;
    cb.dispatchEvent(new Event('change'));
  });
}

// Update select all button text
function updateSelectAllButton() {
  const checkboxes = document.querySelectorAll('.storage-checkbox');
  const allChecked = Array.from(checkboxes).every(cb => cb.checked);
  document.getElementById('selectAll').textContent = allChecked ? 'Deselect all' : 'Select all';
}

// Handle target tab change
function handleTargetTabChange() {
  const targetTabId = document.getElementById('targetTab').value;
  document.getElementById('transferBtn').disabled = !targetTabId;
}

// Transfer storage to target tab
async function transferStorage() {
  const targetTabId = parseInt(document.getElementById('targetTab').value);
  
  if (selectedItems.length === 0) {
    showStatus('Select items to transfer', 'error');
    return;
  }

  try {
    const localItems = selectedItems.filter(item => item.type === 'localStorage');
    const sessionItems = selectedItems.filter(item => item.type === 'sessionStorage');
    const cookieItems = selectedItems.filter(item => item.type === 'cookie');

    // Transfer localStorage and sessionStorage
    if (localItems.length > 0 || sessionItems.length > 0) {
      await chrome.scripting.executeScript({
        target: { tabId: targetTabId },
        func: (local, session) => {
          local.forEach(item => {
            localStorage.setItem(item.key, item.value);
          });
          session.forEach(item => {
            sessionStorage.setItem(item.key, item.value);
          });
        },
        args: [localItems, sessionItems]
      });
    }

    // Transfer cookies
    if (cookieItems.length > 0) {
      const targetTab = tabs.find(t => t.id === targetTabId);
      if (!targetTab || !targetTab.url) {
        throw new Error('Target tab not found or invalid');
      }
      
      const targetUrl = new URL(targetTab.url);
      
      for (const item of cookieItems) {
        const cookie = item.fullData;
        if (!cookie) {
          continue;
        }
        
        try {
          await chrome.cookies.set({
            url: targetUrl.origin,
            name: cookie.name,
            value: cookie.value,
            domain: cookie.domain,
            path: cookie.path,
            secure: cookie.secure,
            httpOnly: cookie.httpOnly,
            sameSite: cookie.sameSite,
            expirationDate: cookie.expirationDate
          });
        } catch (cookieError) {
          console.warn('Failed to set cookie:', cookie.name, cookieError);
        }
      }
    }

    showStatus(`✓ ${selectedItems.length} items transferred successfully`, 'success');
    
    document.getElementById('transferBtn').disabled = true;
    document.getElementById('transferBtn').textContent = 'Transferred ✓';
    
    setTimeout(() => {
      window.close();
    }, 2000);
    
  } catch (error) {
    showStatus('Error: ' + error.message, 'error');
    console.error(error);
  }
}

// Show status message
function showStatus(message, type) {
  const statusDiv = document.getElementById('statusMsg');
  const statusText = statusDiv.querySelector('p');
  
  statusDiv.className = 'status-message';
  if (type === 'success') {
    statusDiv.classList.add('status-success');
  } else {
    statusDiv.classList.add('status-error');
  }
  statusText.textContent = message;
  statusDiv.classList.remove('hidden');
  
  if (type === 'success' && !message.includes('found')) {
    setTimeout(() => {
      statusDiv.classList.add('hidden');
    }, 5000);
  }
}
