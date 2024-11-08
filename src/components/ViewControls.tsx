import React from "react";
import "./ViewControls.css";

interface ViewControlsProps {
	onZoomIn: () => void;
	onZoomOut: () => void;
	onExpandAll: () => void;
	onCollapseAll: () => void;
	onViewChange: (view: "tree" | "list") => void;
	currentView: "tree" | "list";
}

export const ViewControls: React.FC<ViewControlsProps> = ({
	onZoomIn,
	onZoomOut,
	onExpandAll,
	onCollapseAll,
	onViewChange,
	currentView,
}) => {
	return (
		<div className="view-controls">
			<div className="control-group">
				<button onClick={onZoomIn} title="放大">
					<span>+</span>
				</button>
				<button onClick={onZoomOut} title="缩小">
					<span>-</span>
				</button>
			</div>
			<div className="control-group">
				<button onClick={onExpandAll} title="展开所有">
					<span>↓</span>
				</button>
				<button onClick={onCollapseAll} title="折叠所有">
					<span>↑</span>
				</button>
			</div>
			<div className="control-group">
				<button
					className={currentView === "tree" ? "active" : ""}
					onClick={() => onViewChange("tree")}
					title="树形视图"
				>
					<span>🌲</span>
				</button>
				<button
					className={currentView === "list" ? "active" : ""}
					onClick={() => onViewChange("list")}
					title="列表视图"
				>
					<span>📋</span>
				</button>
			</div>
		</div>
	);
};
