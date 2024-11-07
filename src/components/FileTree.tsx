import React from "react";
import Tree from "react-d3-tree";
import { FileNode } from "../utils/fileSystem";

interface FileTreeProps {
	data: FileNode;
}

export const FileTree: React.FC<FileTreeProps> = ({ data }) => {
	const formatData = (
		node: FileNode
	): {
		name: string;
		attributes: {
			type: string;
			path: string;
		};
		children: any[];
	} => {
		return {
			name: node.name,
			attributes: {
				type: node.type,
				path: node.path,
			},
			children: node.children ? node.children.map(formatData) : [],
		};
	};

	return (
		<div style={{ width: "100%", height: "100vh" }}>
			<Tree
				data={formatData(data)}
				orientation="vertical"
				pathFunc="step"
				translate={{ x: 500, y: 50 }}
			/>
		</div>
	);
};
