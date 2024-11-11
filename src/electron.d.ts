interface ElectronAPI {
	selectFolder: () => Promise<{ path: string; treeData: any } | null>;
	getFileStats: (path: string) => Promise<{
		size: number;
		created: Date;
		modified: Date;
	}>;
	openPath: (path: string) => Promise<boolean>;
}

interface Window {
	electronAPI: ElectronAPI;
}
