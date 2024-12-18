import React from "react";
import "./FileInfo.css";
import { FileNode } from "../utils/fileSystem";

interface FileInfoProps {
	node: FileNode | null;
	onClose: () => void;
}

export const FileInfo: React.FC<FileInfoProps> = ({ node, onClose }) => {
	const [stats, setStats] = React.useState<any>(null);

	React.useEffect(() => {
		const loadStats = async () => {
			if (node) {
				try {
					const fileStats = await window.electronAPI.getFileStats(
						node.path
					);
					setStats(fileStats);
				} catch (error) {
					console.error("Error loading file stats:", error);
				}
			}
		};
		loadStats();
	}, [node]);

	const handleOpenPath = async () => {
		if (!node) return;

		try {
			const success = await window.electronAPI.openPath(node.path);
			if (!success) {
				console.error("无法打开路径");
			}
		} catch (error) {
			console.error("打开路径时出错:", error);
		}
	};

	if (!node || !stats) return null;

	const formatSize = (bytes: number) => {
		const units = ["B", "KB", "MB", "GB", "TB"];
		let size = bytes;
		let unitIndex = 0;
		while (size >= 1024 && unitIndex < units.length - 1) {
			size /= 1024;
			unitIndex++;
		}
		return `${size.toFixed(2)} ${units[unitIndex]}`;
	};

	return (
		<div className="file-info">
			<div className="file-info-header">
				<h3>{node.name}</h3>
				<button className="close-button" onClick={onClose}>
					✕
				</button>
			</div>
			<div className="info-grid">
				<div className="info-item">
					<span className="label">类型：</span>
					<span>{node.type === "directory" ? "文件夹" : "文件"}</span>
				</div>
				<div className="info-item">
					<span className="label">大小：</span>
					<span>{formatSize(stats.size)}</span>
				</div>
				<div className="info-item">
					<span className="label">创建时间：</span>
					<span>{new Date(stats.created).toLocaleString()}</span>
				</div>
				<div className="info-item">
					<span className="label">修改时间：</span>
					<span>{new Date(stats.modified).toLocaleString()}</span>
				</div>
				<div className="info-item">
					<button className="open-button" onClick={handleOpenPath}>
						{node.type === "directory"
							? "打开文件夹"
							: "在文件夹中显示"}
					</button>
				</div>
			</div>
		</div>
	);
};
