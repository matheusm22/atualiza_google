document.getElementById('start').addEventListener('click', () => {
    const intervalInput = document.getElementById('interval').value;
    const interval = parseInt(intervalInput, 10);
  
    if (isNaN(interval) || interval <= 0) {
      document.getElementById('status').textContent = "Por favor, insira um valor válido!";
      return;
    }
  
    chrome.storage.local.set({ refreshInterval: interval }, () => {
      document.getElementById('status').textContent = `Intervalo definido para ${interval} segundos.`;
      chrome.runtime.sendMessage({ action: 'start', interval });
    });
  });

  
  // Carrega o estado atual no campo de entrada ao abrir o popup
chrome.storage.local.get('refreshInterval', (data) => {
  const intervalInput = document.getElementById('interval');
  intervalInput.value = data.refreshInterval || 45;
});

// Configura o novo intervalo ao clicar em "Start"
document.getElementById('start').addEventListener('click', () => {
  const intervalInput = document.getElementById('interval').value;
  const interval = parseInt(intervalInput, 10);

  if (isNaN(interval) || interval <= 0) {
    document.getElementById('status').textContent = "Por favor, insira um valor válido!";
    return;
  }

  chrome.runtime.sendMessage({ action: 'start', interval }, () => {
    chrome.storage.local.set({ refreshInterval: interval });
    document.getElementById('status').textContent = `Intervalo definido para ${interval} segundos.`;
  });
});
