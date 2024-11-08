interface ElectronAPI {
	selectFolder: () => Promise<string>;
}

interface Window {
	electronAPI: ElectronAPI;
}
