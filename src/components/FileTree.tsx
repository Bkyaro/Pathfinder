import React from "react";
import Tree from "react-d3-tree";
import { FileNode } from "../utils/fileSystem";
import { ListView } from "./ListView";

interface FileTreeProps {
	data: FileNode;
	zoom: number;
	onNodeSelect: (node: FileNode) => void;
	view: "tree" | "list";
}

export const FileTree: React.FC<FileTreeProps> = ({
	data,
	zoom,
	onNodeSelect,
	view,
}) => {
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
		<g
			onClick={() => {
				toggleNode();
				onNodeSelect({
					name: nodeDatum.name,
					path: nodeDatum.attributes.path,
					type: nodeDatum.attributes.type,
				});
			}}
		>
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

	if (view === "list") {
		return <ListView data={data} onNodeSelect={onNodeSelect} />;
	}

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
				zoom={zoom}
			/>
		</div>
	);
};
