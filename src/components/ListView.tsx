import React from "react";
import { FileNode } from "../utils/fileSystem";
import "./ListView.css";

interface ListViewProps {
  data: FileNode;
  onNodeSelect: (node: FileNode) => void;
}

export const ListView: React.FC<ListViewProps> = ({ data, onNodeSelect }) => {
  const renderNode = (node: FileNode, level: number = 0) => {
    const paddingLeft = `${level * 20}px`;
    
    return (
      <div key={node.path}>
        <div 
          className="list-item" 
          style={{ paddingLeft }}
          onClick={() => onNodeSelect(node)}
        >
          <span className="icon">
            {node.type === "directory" ? "📁" : "📄"}
          </span>
          <span className="name">{node.name}</span>
          <span className="type">{node.type}</span>
        </div>
        {node.children && node.children.map(child => renderNode(child, level + 1))}
      </div>
    );
  };

  return (
    <div className="list-view">
      {renderNode(data)}
    </div>
  );
};