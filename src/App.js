import React, { useEffect, useState } from 'react';
import './App.css';
import NodeGraph from './components/NodeGraph';
import Dashboard from './components/Dashboard';

function App() {
  const [drives, setDrives] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [systemInfo, setSystemInfo] = useState({
    totalNodes: 0,
    totalConnections: 0,
    activeDrives: 0,
  });

  useEffect(() => {
    const initializeDrives = async () => {
      try {
        const driveList = await window.fileAPI.getDrives();
        setDrives(driveList);
        setSystemInfo((prev) => ({ ...prev, activeDrives: driveList.length }));

        const nodes = driveList.map((drive, idx) => {
          const angle = (idx / Math.max(driveList.length, 1)) * (Math.PI * 2);
          const distance = 5;
          return {
            id: drive.path,
            label: drive.name,
            type: 'drive',
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance * 0.6,
            z: Math.sin(angle * 2) * 2,
            size: 2,
            icon: '💾',
          };
        });

        setGraphData({ nodes, links: [] });
        setSystemInfo((prev) => ({ ...prev, totalNodes: nodes.length }));
      } catch (error) {
        console.error('Error loading drives:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeDrives();
  }, []);

  const handleNodeClick = async (nodeId) => {
    setSelectedNode(nodeId);

    const clickedNode = graphData.nodes.find((n) => n.id === nodeId);
    if (!clickedNode) return;

    try {
      const contents = await window.fileAPI.getDirectoryContents(nodeId);

      const newNodes = contents
        .filter((item) => !graphData.nodes.some((n) => n.id === item.path))
        .map((item, idx) => {
          const angle = (idx / Math.max(contents.length, 1)) * (Math.PI * 2);
          const distance = 2.5;
          return {
            id: item.path,
            label: item.name,
            type: item.type,
            x: (clickedNode.x || 0) + Math.cos(angle) * distance,
            y: (clickedNode.y || 0) + Math.sin(angle) * distance,
            z: (clickedNode.z || 0) + (Math.random() - 0.5) * 1.5,
            size: item.type === 'folder' ? 1.2 : 0.8,
            icon: item.icon,
          };
        });

      const newLinks = contents.map((item) => ({
        source: nodeId,
        target: item.path,
      }));

      setGraphData((prev) => {
        const updated = {
          nodes: [...prev.nodes, ...newNodes],
          links: [...prev.links, ...newLinks],
        };
        setSystemInfo((info) => ({
          ...info,
          totalNodes: updated.nodes.length,
          totalConnections: updated.links.length,
        }));
        return updated;
      });
    } catch (error) {
      console.error('Error loading directory:', error);
    }
  };

  const handleOpenInExplorer = async (nodePath) => {
    if (nodePath) {
      await window.fileAPI.openFileExplorer(nodePath);
    }
  };

  return (
    <div className="app">
      <header className="aios-header">
        <div className="header-left">
          <div className="logo-icon">◆</div>
          <div className="header-text">
            <h1>3D FILE EXPLORER</h1>
            <p className="subtitle">AIOS Network Topology Visualizer</p>
          </div>
        </div>
        <div className="header-right">
          <div className="status-indicator">
            <span className="pulse"></span>
            <span>{loading ? 'INITIALIZING...' : 'ONLINE'}</span>
          </div>
        </div>
      </header>

      <main className="workspace">
        <Dashboard
          selectedNode={selectedNode}
          graphData={graphData}
          systemInfo={systemInfo}
          onOpenInExplorer={handleOpenInExplorer}
        />
        <div className="canvas-container">
          <NodeGraph
            data={graphData}
            selectedNodeId={selectedNode}
            onNodeClick={handleNodeClick}
          />
        </div>
      </main>

      <footer className="aios-footer">
        <div className="footer-stat">NODES: {graphData.nodes.length}</div>
        <div className="footer-stat">CONNECTIONS: {graphData.links.length}</div>
        <div className="footer-stat">ACTIVE: {systemInfo.activeDrives}</div>
        <div className="footer-time" id="time"></div>
      </footer>
    </div>
  );
}

// Update footer time
setInterval(() => {
  const timeEl = document.getElementById('time');
  if (timeEl) {
    timeEl.textContent = new Date().toLocaleTimeString();
  }
}, 1000);

export default App;
