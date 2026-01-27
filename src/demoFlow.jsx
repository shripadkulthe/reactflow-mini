import React from 'react';
import { ReactFlow, Background, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: 'n1',
    type: 'input',
    position: { x: 0, y: 50 },
    data: { label: 'Start Node' },
  },
  {
    id: 'n2',
    position: { x: 200, y: 150 },
    data: { label: 'Process Node' },
  },
  {
    id: 'n3',
    type: 'output',
    position: { x: 400, y: 50 },
    data: { label: 'End Node' },
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: 'n1',
    target: 'n2',
    label: 'start → process',
    animated: true,
  },
  {
    id: 'e2-3',
    source: 'n2',
    target: 'n3',
    label: 'process → end',
    animated: true,
  },
];

export default function DemoFlow() {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}