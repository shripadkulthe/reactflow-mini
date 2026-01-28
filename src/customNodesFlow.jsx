import React from 'react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

function SliderNode() {
  return (
    <div style={{ padding: 12, width: 160, background: '#fff', border: '1px solid #000' }}>
      <strong>Slider Node</strong>
      <input className="nodrag" type="range" min={0} max={100}  />

      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
}

function FixedNode() {
  return (
    <div
      className="nopan"
      style={{ padding: 10, border: '1px solid #000', background: '#fff' }}
    >
      <strong>Fixed Node</strong>
      <p>Fixed content</p>

      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
}

function ScrollNode() {
  return (
    <div
      className="nowheel"
      style={{
        padding: 12,
        height: 60,
        background: '#fff',
        border: '1px solid #000',
        overflow: 'auto',
      }}
    >
      <strong>Scroll Node</strong>
      <p>Scrollable content</p>
      <p>More content...</p>

      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

const initialNodes = [
  { id: 'n1', type: 'slider', position: { x: 50, y: 120 }, data: {} },
  { id: 'n2', type: 'fixed', position: { x: 340, y: 150 }, data: {} },
  { id: 'n3', type: 'scroll', position: { x: 550, y: 120 }, data: {} },
];

const initialEdges = [
  { id: 'e1-2', source: 'n1', target: 'n2' },
  { id: 'e2-3', source: 'n2', target: 'n3' },
];

const nodeTypes = {
  slider: SliderNode,
  fixed: FixedNode,
  scroll: ScrollNode,
};

export default function CustomNodesFlow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div style={{ height: '100vh', width: '100%',  }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
