import React from 'react';
import ReactFlow, { ReactFlowProvider, MiniMap, Controls, Handle, Position, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';

function EditableNode({ data, id, isConnectable }) {
  const [label, setLabel] = React.useState(data.label);

  const handleChange = (e) => setLabel(e.target.value);
  const handleButtonClick = () => {
    data.label = label;
    alert(`Node ${id} updated to: ${label}`);
  };

  return (
    <div style={{
      padding: 14,
      border: '2px solid #555',
    }}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <input
        style={{ width: '100%', marginBottom: 5 }}
        value={label}
        onChange={handleChange}
      />
      <button onClick={handleButtonClick} style={{ width: '100%' }}>Update</button>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}

const nodeTypes = { editableNode: EditableNode };

export default function CustomFlow() {
  const initialNodes = [
    { id: '1', type: 'input', data: { label: 'Start Node' }, position: { x: 0, y: 50 } },
    { id: '2', type: 'editableNode', data: { label: 'Editable Node' }, position: { x: 200, y: 150 } },
    { id: '3', type: 'output', data: { label: 'End Node' }, position: { x: 500, y: 50 } },
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