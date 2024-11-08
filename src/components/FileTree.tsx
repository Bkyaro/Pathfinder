import React from "react";
import Tree from "react-d3-tree";
import { FileNode } from "../utils/fileSystem";

interface FileTreeProps {
	data: FileNode;
}

export const FileTree: React.FC<FileTreeProps> = ({ data }) => {
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

	// 自定义节点渲染
	const renderCustomNode = ({ nodeDatum, toggleNode }: any) => (
		<g onClick={toggleNode}>
			<circle
				r={10}
				fill={
					nodeDatum.attributes.type === "directory"
						? "#E3A008"
						: "#2B6CB0"
				}
			/>
			<text fill="black" strokeWidth="0.5" x={15} dy="0.31em">
				{nodeDatum.name}
			</text>
			<text fill="gray" fontSize="10" x={15} dy="20">
				{nodeDatum.attributes.type}
			</text>
		</g>
	);

	return (
		<div
			style={{
				width: "100%",
				height: "100vh",
				backgroundColor: "#f5f5f5",
			}}
		>
			<Tree
				data={formatData(data)}
				orientation="vertical"
				pathFunc="step"
				translate={{ x: window.innerWidth / 2, y: 50 }}
				renderCustomNodeElement={renderCustomNode}
				separation={{ siblings: 2, nonSiblings: 2 }}
				zoom={0.8}
			/>
		</div>
	);
};
