const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) => {
    // Whitelist channels that can be subscribed to
    let validChannels = ["test-event-from-main", "update-dom", "test-event"];
    if (validChannels.includes(channel)) {
      //   ipcRenderer.on(channel, (event, ...args) => func(...args));
      ipcRenderer.once(channel, (event, ...args) => func(...args));
    }
  },
});
