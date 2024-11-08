import React, { useState } from "react";
import { FileNode } from "../utils/fileSystem";
import "./ListView.css";

interface ListViewProps {
	data: FileNode;
	onNodeSelect: (node: FileNode) => void;
	expandedNodes: Set<string>;
	onToggleNode: (path: string) => void;
}

export const ListView: React.FC<ListViewProps> = ({ data, onNodeSelect }) => {
	const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
		new Set([data.path])
	);

	const toggleNode = (path: string) => {
		setExpandedNodes((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(path)) {
				newSet.delete(path);
			} else {
				newSet.add(path);
			}
			return newSet;
		});
	};

	const renderNode = (node: FileNode, level: number = 0) => {
		const paddingLeft = `${level * 20}px`;
		const isExpanded = expandedNodes.has(node.path);

		return (
			<div key={node.path}>
				<div className="list-item" style={{ paddingLeft }}>
					{node.type === "directory" && (
						<span
							className="toggle-icon"
							onClick={() => toggleNode(node.path)}
						>
							{isExpanded ? "▼" : "▶"}
						</span>
					)}
					<span className="icon" onClick={() => onNodeSelect(node)}>
						{node.type === "directory" ? "📁" : "📄"}
					</span>
					<span className="name" onClick={() => onNodeSelect(node)}>
						{node.name}
					</span>
					<span className="type">{node.type}</span>
				</div>
				{isExpanded && node.children && (
					<div className="children">
						{node.children.map((child) =>
							renderNode(child, level + 1)
						)}
					</div>
				)}
			</div>
		);
	};

	return <div className="list-view">{renderNode(data)}</div>;
};
