import React from 'react';
import { ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState, addEdge, BaseEdge, EdgeLabelRenderer, getStraightPath, useReactFlow } from '@xyflow/react';  
import '@xyflow/react/dist/style.css';

function CustomEdge({ id, sourceX, sourceY, targetX, targetY }) {
  const { deleteElements } = useReactFlow();

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <button
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
          onClick={() => deleteElements({ edges: [{ id }] })}
        >
          delete
        </button>
      </EdgeLabelRenderer>
    </>
  );
}

const initialNodes = [
  { id: 'n1', type: 'input', position: { x: 50, y: 100 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 300, y: 200 }, data: { label: 'Node 2' } },
  { id: 'n3', type: 'output', position: { x: 550, y: 100 }, data: { label: 'Node 3' } },
];

const initialEdges = [
  { id: 'e1', source: 'n1', target: 'n2', type: 'custom-edge' },
  { id: 'e2', source: 'n2', target: 'n3', type: 'custom-edge' },
];

export default function CustomEdgeFlow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params) =>
    setEdges((eds) => addEdge({ ...params, type: 'custom-edge' }, eds));

  return (
    <div style={{ height: '100vh' , width: '100%',  }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={{ 'custom-edge': CustomEdge }}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
