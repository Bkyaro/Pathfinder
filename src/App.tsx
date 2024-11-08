import { useState } from "react";
import "./App.css";
import { FileTree } from "./components/FileTree";
import { FileInfo } from "./components/FileInfo";
import { ViewControls } from "./components/ViewControls";

function App() {
	const [treeData, setTreeData] = useState<any | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedNode, setSelectedNode] = useState<any | null>(null);
	const [currentView, setCurrentView] = useState<"tree" | "list">("tree");
	const [zoom, setZoom] = useState(0.8);
	const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

	const handleSelectFolder = async () => {
		try {
			const result = await window.electronAPI.selectFolder();
			if (result) {
				setTreeData(result.treeData);
			}
		} catch (error) {
			console.error("选择文件夹时出错:", error);
		}
	};

	const handleNodeSelect = (node: any) => {
		setSelectedNode(node);
	};

	const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2));
	const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.3));

	const handleViewChange = (view: "tree" | "list") => {
		setCurrentView(view);
	};

	const handleCloseInfo = () => {
		setSelectedNode(null);
	};

	// 展开所有节点
	const handleExpandAll = () => {};

	// 折叠所有节点
	const handleCollapseAll = () => {};

	return (
		<div className="app-container">
			<div className="header">
				<button onClick={handleSelectFolder}>选择文件夹</button>
				{treeData && (
					<>
						<input
							type="text"
							placeholder="搜索文件或文件夹..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="search-input"
						/>
						<ViewControls
							onZoomIn={handleZoomIn}
							onZoomOut={handleZoomOut}
							onExpandAll={handleExpandAll}
							onCollapseAll={handleCollapseAll}
							onViewChange={handleViewChange}
							currentView={currentView}
						/>
					</>
				)}
			</div>
			<div className="main-content">
				<div className="tree-container">
					{treeData ? (
						<FileTree
							data={treeData}
							zoom={zoom}
							onNodeSelect={handleNodeSelect}
							view={currentView}
						/>
					) : (
						<div className="empty-state">
							请选择一个文件夹来查看其结构
						</div>
					)}
				</div>
				{selectedNode && (
					<div className="info-panel">
						<FileInfo
							node={selectedNode}
							onClose={handleCloseInfo}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
