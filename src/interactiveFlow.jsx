import React, { useCallback, useState } from 'react';
import { ReactFlow, ReactFlowProvider, Background, Controls, MiniMap, Panel, useNodesState, useEdgesState, addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css';


const initialNodes = [
  { id: 'n1', type: 'input', data: { label: 'Node 1' }, position: { x: 0, y: 50 } },
  { id: 'n2', data: { label: 'Node 2' }, position: { x: 200, y: 150 } },
  { id: 'n3', type: 'output', data: { label: 'Node 3' }, position: { x: 400, y: 50 } },
];

const initialEdges = [
  { id: 'e1-2', source: 'n1', target: 'n2', label: 'connects', animated: true },
  { id: 'e2-3', source: 'n2', target: 'n3', label: 'connects', animated: true },
];

export default function InteractiveFlow() {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);

  const onNodesChange = useCallback(
  (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
  [setNodes],
);

  const onEdgesChange = useCallback(
  (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
  [setEdges],
);

  const onConnect = useCallback(
  (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
  [setEdges],
);

const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          selectionMode="partial"
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          onNodeClick={onNodeClick}
        >
          <MiniMap />
          <Controls />
          <Background />
          <Panel position="top-left">
            <div style={{ padding: 8, backgroundColor: '#fff', border: '1px solid #333' }}>
              {selectedNode ? (
                <div>
                  <strong>Selected Node:</strong> {selectedNode.data.label}
                </div>
              ) : (
                <div>No node selected</div>
              )}
            </div>
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
