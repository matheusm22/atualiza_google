let refreshInterval = 120;
let timeLeft = refreshInterval;
let intervalId = null;
let targetTabId = null;

function updateBadge() {
  chrome.action.setBadgeText({ text: timeLeft.toString() });
  chrome.action.setBadgeBackgroundColor({ color: "#00FF00" }); // Verde
}

function refreshPage() {
  if (targetTabId !== null) {
    chrome.tabs.reload(targetTabId);
  }
  timeLeft = refreshInterval;
  updateBadge();
}

function startRefreshing(tabId) {
  if (intervalId) {
    clearInterval(intervalId);
  }

  targetTabId = tabId;

  intervalId = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      refreshPage();
    } else {
      updateBadge();
    }
  }, 1000);
}

function stop() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    chrome.action.setBadgeText({ text: "" });
  }
  targetTabId = null;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'start') {
    refreshInterval = message.interval;
    timeLeft = refreshInterval;

    if (sender.tab && sender.tab.id !== undefined) {
      startRefreshing(sender.tab.id);
    } else {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          startRefreshing(tabs[0].id);
        }
      });
    }
  }

  if (message.action === 'stop') {
    stop();
  }
});
