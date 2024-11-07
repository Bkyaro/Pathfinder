import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";

function createWindow() {
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	if (process.env.NODE_ENV === "development") {
		win.loadURL("http://localhost:5173");
	} else {
		win.loadFile(path.join(__dirname, "../dist/index.html"));
	}

	// 添加选择文件夹的IPC监听器
	ipcMain.handle("select-folder", async () => {
		const result = await dialog.showOpenDialog(win, {
			properties: ["openDirectory"],
		});
		return result.filePaths[0];
	});
}

app.whenReady().then(() => {
	createWindow();
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
