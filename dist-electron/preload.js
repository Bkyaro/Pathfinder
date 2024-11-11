"use strict";
const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
    selectFolder: () => ipcRenderer.invoke("select-folder"),
    getFileStats: (path) => ipcRenderer.invoke("get-file-stats", path),
    openPath: (path) => ipcRenderer.invoke("open-path", path), // 添加这一行
});
