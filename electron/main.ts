const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const { shell } = require("electron");

// 打开指定目录文件夹
ipcMain.handle("open-path", async (_, filePath: string) => {
	try {
		// 如果是文件，则打开其所在文件夹并选中该文件
		if (fs.statSync(filePath).isFile()) {
			await shell.showItemInFolder(filePath);
		} else {
			// 如果是文件夹，直接打开文件夹
			await shell.openPath(filePath);
		}
		return true;
	} catch (error) {
		console.error("打开路径失败:", error);
		return false;
	}
});

// 使用 process.cwd() 获取当前工作目录
const ROOT_PATH = process.cwd();

function scanDirectory(dirPath) {
	const stats = fs.statSync(dirPath);
	const baseName = path.basename(dirPath);

	if (!stats.isDirectory()) {
		return {
			name: baseName,
			path: dirPath,
			type: "file",
		};
	}

	const children = fs.readdirSync(dirPath).map((file) => {
		const fullPath = path.join(dirPath, file);
		return scanDirectory(fullPath);
	});

	return {
		name: baseName,
		path: dirPath,
		type: "directory",
		children,
	};
}

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
	} else {
		console.log("Loading production file...");
		const indexPath = path.join(ROOT_PATH, "dist", "index.html");
		console.log("Index path:", indexPath);
		win.loadFile(indexPath).catch(console.error);
	}

	ipcMain.handle("select-folder", async () => {
		const result = await dialog.showOpenDialog(win, {
			properties: ["openDirectory"],
		});
		if (result.filePaths[0]) {
			const dirPath = result.filePaths[0];
			const treeData = scanDirectory(dirPath);
			console.log(" { path: dirPath, treeData }", {
				path: dirPath,
				treeData,
			});
			return { path: dirPath, treeData };
		}
		return null;
	});

	ipcMain.handle("get-file-stats", async (_, filePath) => {
		const stats = fs.statSync(filePath);
		return {
			size: stats.size,
			created: stats.birthtime,
			modified: stats.mtime,
		};
	});

	// 添加错误处理
	win.webContents.on(
		"did-fail-load",
		(event, errorCode, errorDescription) => {
			console.error("Page failed to load:", errorCode, errorDescription);
		}
	);
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
