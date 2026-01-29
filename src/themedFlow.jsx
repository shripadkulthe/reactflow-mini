import React, { useCallback, useState } from 'react';
import { ReactFlow, useNodesState, useEdgesState, addEdge, MiniMap, Controls, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

function CustomNode({ data }) {
  return (
    <div className="org-node">
      <div className="org-node-header">
        <div className="org-node-avatar">{data.emoji}</div>
        <div>
          <div className="org-node-name">{data.name}</div>
          <div className="org-node-role">{data.role}</div>
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="org-handle" />
      <Handle type="source" position={Position.Bottom} className="org-handle" />
    </div>
  );
}

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes = [
  {
    id: '1',
    type: 'custom',
    data: { name: 'Shriniwas Kalantri', role: 'CEO', emoji: '👨‍💼' },
    position: { x: 250, y: 0 },
  },

  {
    id: '2',
    type: 'custom',
    data: { name: 'Saurabh Kalantri', role: 'Director (Engineering)', emoji: '🧠' },
    position: { x: 50, y: 140 },
  },
  {
    id: '3',
    type: 'custom',
    data: { name: 'Anita Kalantri', role: 'Co-Director (Operations)', emoji: '📊' },
    position: { x: 500, y: 140 },
  },

  {
    id: '8',
    type: 'custom',
    data: { name: 'Sumit Wagh', role: 'Manager', emoji: '🧑‍🏫' },
    position: { x: 60, y: 300 },
  },

  {
    id: '9',
    type: 'custom',
    data: { name: 'Shripad Kulthe', role: 'Software Engineer', emoji: '💻' },
    position: { x: -120, y: 470 },
  },
  {
    id: '10',
    type: 'custom',
    data: { name: 'Vyanktesh Kalantri', role: 'Software Engineer', emoji: '🖥️' },
    position: { x: 80, y: 470 },
  },
  {
    id: '12',
    type: 'custom',
    data: { name: 'Prathmesh Kalantri', role: 'Software Engineer', emoji: '🧑‍💻' },
    position: { x: 300, y: 470 },
  },

  {
    id: '11',
    type: 'custom',
    data: { name: 'HR Team', role: 'Human Resources', emoji: '🧑‍💼' },
    position: { x: 540, y: 300 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },

  { id: 'e2-8', source: '2', target: '8' },
  { id: 'e8-9', source: '8', target: '9' },
  { id: 'e8-10', source: '8', target: '10' },
  { id: 'e8-12', source: '8', target: '12' },

  { id: 'e3-11', source: '3', target: '11' },
];

export default function ThemedFlow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [darkMode, setDarkMode] = useState(false);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className={darkMode ? 'dark' : 'light'} style={{ height: '100vh' }}>
      <button onClick={() => setDarkMode((d) => !d)} className="theme-toggle">
        Toggle Theme
      </button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
