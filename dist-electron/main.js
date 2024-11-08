"use strict";
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
// 使用 process.cwd() 获取当前工作目录
const ROOT_PATH = process.cwd();
function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(ROOT_PATH, "dist-electron", "preload.js"),
        },
    });
    if (process.env.NODE_ENV === "development") {
        console.log("Loading development URL...");
        win.loadURL("http://localhost:5173").catch(console.error);
        win.webContents.openDevTools();
    }
    else {
        console.log("Loading production file...");
        const indexPath = path.join(ROOT_PATH, "dist", "index.html");
        console.log("Index path:", indexPath);
        win.loadFile(indexPath).catch(console.error);
    }
    ipcMain.handle("select-folder", async () => {
        const result = await dialog.showOpenDialog(win, {
            properties: ["openDirectory"],
        });
        return result.filePaths[0];
    });
    // 添加错误处理
    win.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
        console.error("Page failed to load:", errorCode, errorDescription);
    });
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
