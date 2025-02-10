let refreshInterval = 120; // Intervalo padrão em segundos
let timeLeft = refreshInterval; // Tempo restante
let intervalId = null;
let targetTabId = null; // Aba que será atualizada

// Atualiza o badge com o tempo restante
function updateBadge() {
  chrome.action.setBadgeText({ text: timeLeft.toString() });
  chrome.action.setBadgeBackgroundColor({ color: "#008000" });
}

// Atualiza a aba específica
function refreshPage() {
  if (targetTabId !== null) {
    chrome.tabs.get(targetTabId, (tab) => {
      if (chrome.runtime.lastError || !tab) {
        console.log("Aba fechada ou não encontrada, parando o contador.");
        clearInterval(intervalId);
        intervalId = null;
        chrome.action.setBadgeText({ text: "" });
        return;
      }
      chrome.tabs.reload(targetTabId);
      timeLeft = refreshInterval; // Reseta o tempo restante
      updateBadge();
    });
  }
}

// Inicia o intervalo
function startRefreshing(tabId) {
  targetTabId = tabId; // Define a aba específica
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

  // Salva as configurações no armazenamento
  chrome.storage.local.set({ refreshInterval, timeLeft, targetTabId });
}

// Recupera o estado salvo ao iniciar a extensão
chrome.storage.local.get(['refreshInterval', 'timeLeft', 'targetTabId'], (data) => {
  refreshInterval = data.refreshInterval || 45;
  timeLeft = data.timeLeft || refreshInterval;
  targetTabId = data.targetTabId || null;
  if (targetTabId) {
    startRefreshing(targetTabId);
  }
});

// Salva o estado antes de o service worker encerrar
chrome.runtime.onSuspend.addListener(() => {
  chrome.storage.local.set({ refreshInterval, timeLeft, targetTabId });
});

// Ouve mensagens do popup para iniciar/atualizar o intervalo
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === 'start') {
    refreshInterval = message.interval;
    timeLeft = refreshInterval;

    // Obtém a aba ativa no momento e inicia o contador apenas para ela
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        startRefreshing(tabs[0].id);
      }
    });
  }
});
