document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.getElementById("start");
  const stopButton = document.getElementById("stop");
  const intervalInput = document.getElementById("interval");
  const statusText = document.getElementById("status");

  // Enviar mensagem para iniciar o temporizador
  startButton.addEventListener("click", () => {
    const interval = parseInt(intervalInput.value) || 120; // Define um valor padrão se estiver vazio
    chrome.runtime.sendMessage({ action: "start", interval });
    statusText.textContent = `Atualização a cada ${interval} segundos.`;
  });

  // Enviar mensagem para parar o temporizador
  stopButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "stop" });
    statusText.textContent = "Atualização interrompida.";
  });
});

// document.getElementById('start').addEventListener('click', () => {
//     const intervalInput = document.getElementById('interval').value;
//     const interval = parseInt(intervalInput, 10);
  
//     if (isNaN(interval) || interval <= 0) {
//       document.getElementById('status').textContent = "Por favor, insira um valor válido!";
//       return;
//     }
  
//     chrome.storage.local.set({ refreshInterval: interval }, () => {
//       document.getElementById('status').textContent = `Intervalo definido para ${interval} segundos.`;
//       chrome.runtime.sendMessage({ action: 'start', interval });
//     });
//   });
  
//   document.getElementById("stopButton").addEventListener("click", () => {
//     chrome.runtime.sendMessage({ action: "stop" });
//   });
  
  