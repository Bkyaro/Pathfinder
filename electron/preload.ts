const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	selectFolder: () => ipcRenderer.invoke("select-folder"),
	getFileStats: (path) => ipcRenderer.invoke("get-file-stats", path),
});
