"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
// 暴露安全的 API 到渲染进程
electron_1.contextBridge.exposeInMainWorld("electronAPI", {
    selectFolder: function () { return electron_1.ipcRenderer.invoke("select-folder"); }
});
