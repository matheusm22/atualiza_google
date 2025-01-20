let refreshInterval = 45; // Intervalo padrão em segundos
let timeLeft = refreshInterval; // Tempo restante
let intervalId = null;

// Atualiza o badge com o tempo restante
function updateBadge() {
  chrome.action.setBadgeText({ text: timeLeft.toString() });
  chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
}

// Atualiza a aba ativa
function refreshPage() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.reload(tabs[0].id);
    }
  });
  timeLeft = refreshInterval; // Reseta o tempo restante
  updateBadge();
}

// Inicia o intervalo
function startRefreshing() {
  if (intervalId) {
    clearInterval(intervalId);
  }
  intervalId = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      refreshPage();
    } else {
      updateBadge();
    }
  }, 1000);
}

// Ouve mensagens do popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'start') {
    refreshInterval = message.interval;
    timeLeft = refreshInterval;
    startRefreshing();
  }
});

// Define o intervalo inicial ao carregar
chrome.storage.local.get('refreshInterval', (data) => {
  if (data.refreshInterval) {
    refreshInterval = data.refreshInterval;
    timeLeft = refreshInterval;
    startRefreshing();
  }
});
