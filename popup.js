
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
  
