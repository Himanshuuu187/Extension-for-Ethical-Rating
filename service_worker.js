// service_worker.js
// Runs in background (manifest v3 service worker).
// Listens for messages and can be used for future features like remote API calls.

chrome.runtime.onInstalled.addListener(() => {
  console.log("Ethical Shopping Advisor installed.");
  // initialize cache if needed
  chrome.storage.local.get(["brandCache"], (res) => {
    if (!res.brandCache) {
      chrome.storage.local.set({ brandCache: {} });
    }
  });
});

// Accept messages from content scripts or popup.
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === "CACHE_BRAND") {
    const { brand, info } = msg;
    chrome.storage.local.get(["brandCache"], (res) => {
      const brandCache = res.brandCache || {};
      brandCache[brand.toLowerCase()] = {
        info,
        ts: Date.now()
      };
      chrome.storage.local.set({ brandCache }, () => {
        sendResponse({ status: "ok" });
      });
    });
    // indicate we'll call sendResponse asynchronously
    return true;
  }
});
