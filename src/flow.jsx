import React from 'react';
import ReactFlow, { ReactFlowProvider, MiniMap, Controls, Handle, Position, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';

function CustomNode({ data }) {
  return (
    <div style={{ padding: 10, border: '1px solid #555', borderRadius: 5 }}>
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = { customNode: CustomNode };

function Flow() {
  const initialNodes = [
    { id: '1', type: 'input', data: { label: 'Start' }, position: { x: 0, y: 50 } },
    { id: '2', type: 'customNode', data: { label: 'Middle' }, position: { x: 250, y: 150 } },
    { id: '3', type: 'output', data: { label: 'End' }, position: { x: 400, y: 50 } },
  ];

  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3', animated: true },
  ];

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          nodeTypes={nodeTypes}
        >
          <MiniMap />
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}

export default Flow;