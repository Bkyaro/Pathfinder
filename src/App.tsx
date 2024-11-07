import { useState } from 'react';
import { ipcRenderer } from 'electron';
import { FileTree } from './components/FileTree';
import { scanDirectory, FileNode } from './utils/fileSystem';
import './App.css';

function App() {
  const [treeData, setTreeData] = useState<FileNode | null>(null);

  const handleSelectFolder = async () => {
    try {
      const folderPath = await ipcRenderer.invoke('select-folder');
      if (folderPath) {
        const data = scanDirectory(folderPath);
        setTreeData(data);
      }
    } catch (error) {
      console.error('选择文件夹时出错:', error);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <button onClick={handleSelectFolder}>选择文件夹</button>
      </div>
      <div className="tree-container">
        {treeData ? (
          <FileTree data={treeData} />
        ) : (
          <div className="empty-state">请选择一个文件夹来查看其结构</div>
        )}
      </div>
    </div>
  );
}

export default App;