import * as fs from "fs";
import * as path from "path";

export interface FileNode {
	name: string;
	path: string;
	type: "file" | "directory";
	children?: FileNode[];
}

export function scanDirectory(dirPath: string): FileNode {
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
