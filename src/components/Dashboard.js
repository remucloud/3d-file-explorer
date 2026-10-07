import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const formatBytes = (bytes) => {
  if (!bytes || isNaN(bytes)) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(2)} ${units[i]}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleString();
};

function Dashboard({ selectedNode, graphData, systemInfo, onOpenInExplorer }) {
  const [nodeInfo, setNodeInfo] = useState(null);
  const [nodeStats, setNodeStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadNodeInfo = async () => {
      if (!selectedNode) {
        setNodeInfo(null);
        setNodeStats(null);
        return;
      }

      setLoading(true);
      try {
        const stats = await window.fileAPI.getFileStats(selectedNode);
        const dirStats = await window.fileAPI.getDirectoryStats(selectedNode);
        const node = graphData.nodes.find((n) => n.id === selectedNode);

        setNodeInfo({
          name: node?.label || 'Unknown',
          path: selectedNode,
          type: node?.type || 'file',
          icon: node?.icon || '📄',
        });

        setNodeStats({
          size: stats?.size,
          created: stats?.created,
          modified: stats?.modified,
          isDirectory: stats?.isDirectory,
          folders: dirStats?.folders,
          files: dirStats?.files,
          total: dirStats?.total,
        });
      } catch (error) {
        console.error('Error loading node info:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNodeInfo();
  }, [selectedNode, graphData]);

  return (
    <aside className="dashboard">
      <div className="dashboard-header">
        <h2>SYSTEM TELEMETRY</h2>
        <div className="header-underline"></div>
      </div>

      {/* System Overview */}
      <section className="dashboard-section">
        <h3 className="section-title">NETWORK STATUS</h3>
        <div className="status-grid">
          <div className="status-item">
            <span className="label">ACTIVE NODES</span>
            <span className="value">{graphData.nodes.length}</span>
          </div>
          <div className="status-item">
            <span className="label">CONNECTIONS</span>
            <span className="value">{graphData.links.length}</span>
          </div>
          <div className="status-item">
            <span className="label">DRIVES</span>
            <span className="value">{systemInfo.activeDrives}</span>
          </div>
          <div className="status-item">
            <span className="label">DEPTH</span>
            <span className="value">{Math.max(1, graphData.nodes.length > 0 ? 3 : 1)}</span>
          </div>
        </div>
      </section>

      {/* Node Details */}
      {selectedNode ? (
        <section className="dashboard-section">
          <h3 className="section-title">NODE DETAILS</h3>
          {loading ? (
            <div className="loading-spinner">SCANNING...</div>
          ) : nodeInfo ? (
            <div className="node-panel">
              <div className="node-header">
                <span className="node-icon">{nodeInfo.icon}</span>
                <div className="node-name-wrap">
                  <div className="node-name">{nodeInfo.name}</div>
                  <div className="node-type">{nodeInfo.type.toUpperCase()}</div>
                </div>
              </div>

              <div className="divider"></div>

              <div className="info-rows">
                <div className="info-row">
                  <span className="info-label">PATH</span>
                  <span className="info-value path">{nodeInfo.path}</span>
                </div>

                {nodeStats?.size !== undefined && (
                  <div className="info-row">
                    <span className="info-label">SIZE</span>
                    <span className="info-value">{formatBytes(nodeStats.size)}</span>
                  </div>
                )}

                {nodeStats?.isDirectory && (
                  <>
                    <div className="info-row">
                      <span className="info-label">FOLDERS</span>
                      <span className="info-value">{nodeStats.folders}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">FILES</span>
                      <span className="info-value">{nodeStats.files}</span>
                    </div>
                  </>
                )}

                {nodeStats?.created && (
                  <div className="info-row">
                    <span className="info-label">CREATED</span>
                    <span className="info-value">{formatDate(nodeStats.created)}</span>
                  </div>
                )}

                {nodeStats?.modified && (
                  <div className="info-row">
                    <span className="info-label">MODIFIED</span>
                    <span className="info-value">{formatDate(nodeStats.modified)}</span>
                  </div>
                )}
              </div>

              <button
                className="action-btn"
                onClick={() => onOpenInExplorer(selectedNode)}
              >
                ➜ OPEN IN EXPLORER
              </button>
            </div>
          ) : (
            <div className="empty-state">No data available</div>
          )}
        </section>
      ) : (
        <section className="dashboard-section empty-section">
          <div className="empty-message">
            <div className="empty-icon">▲</div>
            <p>SELECT A NODE</p>
            <p className="hint">Click on any node in the 3D graph to view details</p>
          </div>
        </section>
      )}

      <div className="dashboard-footer">
        <div className="footer-badge">AIOS v1.0</div>
      </div>
    </aside>
  );
}

export default Dashboard;
