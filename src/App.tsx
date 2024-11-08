import { useState } from "react";
import "./App.css";
import { FileTree } from "./components/FileTree";
import { FileNode, scanDirectory } from "./utils/fileSystem";

function App() {
	const [treeData, setTreeData] = useState<FileNode | null>(null);
	const [searchTerm, setSearchTerm] = useState("");

	const handleSelectFolder = async () => {
		try {
			const folderPath = await window.electronAPI.selectFolder();
			if (folderPath) {
				const data = scanDirectory(folderPath);
				setTreeData(data);
			}
		} catch (error) {
			console.error("选择文件夹时出错:", error);
		}
	};

	const filterTree = (node: FileNode, term: string): FileNode | null => {
		if (node.name.toLowerCase().includes(term.toLowerCase())) {
			return node;
		}

		if (node.children) {
			const filteredChildren = node.children
				.map((child) => filterTree(child, term))
				.filter((child): child is FileNode => child !== null);

			if (filteredChildren.length > 0) {
				return {
					...node,
					children: filteredChildren,
				};
			}
		}

		return null;
	};

	const filteredData =
		treeData && searchTerm ? filterTree(treeData, searchTerm) : treeData;

	return (
		<div className="app-container">
			<div className="header">
				<button onClick={handleSelectFolder}>选择文件夹</button>
				{treeData && (
					<input
						type="text"
						placeholder="搜索文件或文件夹..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="search-input"
					/>
				)}
			</div>
			<div className="tree-container">
				{filteredData ? (
					<FileTree data={filteredData} />
				) : (
					<div className="empty-state">
						请选择一个文件夹来查看其结构
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
