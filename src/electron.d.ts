interface ElectronAPI {
	selectFolder: () => Promise<{ path: string; treeData: any } | null>;
	getFileStats: (path: string) => Promise<{
		size: number;
		created: Date;
		modified: Date;
	}>;
}

interface Window {
	electronAPI: ElectronAPI;
}
