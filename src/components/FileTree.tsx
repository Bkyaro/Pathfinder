import React from "react";
import Tree from "react-d3-tree";
import { FileNode } from "../utils/fileSystem";
import { ListView } from "./ListView";

interface FileTreeProps {
	data: FileNode;
	zoom: number;
	onNodeSelect: (node: FileNode) => void;
	view: "tree" | "list";
	searchTerm: string;
}

export const FileTree: React.FC<FileTreeProps> = ({
	data,
	zoom,
	onNodeSelect,
	view,
	searchTerm,
}) => {
	// 搜索过滤函数
	const filterData = (node: FileNode, term: string): FileNode | null => {
		// 如果搜索词为空,返回原始节点
		if (!term.trim()) {
			return node;
		}

		// 检查当前节点是否匹配
		const isMatch = node.name.toLowerCase().includes(term.toLowerCase());

		// 如果是目录,递归搜索子节点
		if (node.type === "directory" && node.children) {
			const filteredChildren = node.children
				.map((child) => filterData(child, term))
				.filter((n): n is FileNode => n !== null);

			// 如果当前节点匹配或者有匹配的子节点,返回过滤后的节点
			if (isMatch || filteredChildren.length > 0) {
				return {
					...node,
					children: filteredChildren,
				};
			}
		}

		// 如果是文件且匹配,返回该节点
		return isMatch ? node : null;
	};

	// 获取过滤后的数据
	const displayData = filterData(data, searchTerm) || data;
	const formatData = (node: FileNode): any => {
		return {
			name: node.name,
			attributes: {
				type: node.type,
				path: node.path,
			},
			children: node.children ? node.children.map(formatData) : [],
		};
	};
	const renderCustomNode = ({ nodeDatum, toggleNode }: any) => (
		<g>
			<circle
				r={10}
				fill={
					nodeDatum.attributes.type === "directory"
						? "#E3A008"
						: "#2B6CB0"
				}
				onClick={toggleNode}
			/>
			<text
				fill="black"
				strokeWidth="0.5"
				x={15}
				dy="0.31em"
				onClick={() =>
					onNodeSelect({
						name: nodeDatum.name,
						path: nodeDatum.attributes.path,
						type: nodeDatum.attributes.type,
					})
				}
				style={{ cursor: "pointer" }}
			>
				{nodeDatum.name}
			</text>
			<text fill="gray" fontSize="10" x={15} dy="20">
				{nodeDatum.attributes.type}
			</text>
		</g>
	);

	// 如果是列表视图
	if (view === "list") {
		return <ListView data={displayData} onNodeSelect={onNodeSelect} />;
	}

	// 树形视图
	return (
		<div
			style={{
				width: "100%",
				height: "100vh",
				backgroundColor: "#f5f5f5",
			}}
		>
			<Tree
				data={formatData(displayData)}
				orientation="vertical"
				pathFunc="step"
				translate={{ x: window.innerWidth / 2, y: 50 }}
				renderCustomNodeElement={renderCustomNode}
				separation={{ siblings: 2, nonSiblings: 2 }}
				zoom={zoom}
			/>
		</div>
	);
};
