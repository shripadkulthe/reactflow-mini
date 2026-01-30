import React, { useCallback } from 'react';
import { stratify, tree } from 'd3-hierarchy';
import { ReactFlow, ReactFlowProvider, Panel, useNodesState, useEdgesState, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: '1', type: 'input', data: { label: 'input' }, position: { x: 0, y: 0 } },
  { id: '2', data: { label: 'node 2' }, position: { x: 0, y: 100 } },
  { id: '2a', data: { label: 'node 2a' }, position: { x: 0, y: 200 } },
  { id: '2b', data: { label: 'node 2b' }, position: { x: 0, y: 300 } },
  { id: '2c', data: { label: 'node 2c' }, position: { x: 0, y: 400 } },
  { id: '2d', data: { label: 'node 2d' }, position: { x: 0, y: 500 } },
  { id: '3', data: { label: 'node 3' }, position: { x: 200, y: 100 } },
];

const initialEdges = [
  { id: 'e12', source: '1', target: '2', animated: true },
  { id: 'e13', source: '1', target: '3', animated: true },
  { id: 'e22a', source: '2', target: '2a', animated: true },
  { id: 'e22b', source: '2', target: '2b', animated: true },
  { id: 'e22c', source: '2', target: '2c', animated: true },
  { id: 'e2c2d', source: '2c', target: '2d', animated: true },
];

const g = tree();

const getLayoutedElements = (nodes, edges) => {
  if (nodes.length === 0) return { nodes, edges };

  const hierarchy = stratify()
    .id((node) => node.id)
    .parentId((node) => edges.find((e) => e.target === node.id)?.source);

  const root = hierarchy(nodes);
  const layout = g.nodeSize([200, 100])(root);

  return {
    nodes: layout
      .descendants()
      .map((node) => ({
        ...node.data,
        position: { x: node.x, y: node.y },
      })),
    edges,
  };
};

const LayoutFlow = () => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
    fitView();
  }, [nodes, edges, setNodes, setEdges, fitView]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Panel position="top-right">
        <button onClick={onLayout}>Layout</button>
      </Panel>
    </ReactFlow>
  );
};

export default function DagreHierarchyFlow() {
  return (
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  );
}