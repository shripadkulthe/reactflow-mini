import React, { useCallback } from 'react';
import { ReactFlow, ReactFlowProvider, Panel, useNodesState, useEdgesState, useReactFlow,
} from '@xyflow/react';
import dagre from 'dagre';
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

const getLayoutedElements = (nodes, edges, options = { direction: 'TB' }) => {
  const g = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    }),
  );

  dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;
      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

const LayoutFlow = () => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onLayout = useCallback(
    (direction) => {
      console.log(nodes);
      const layouted = getLayoutedElements(nodes, edges, { direction });
      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);
      fitView();
    },
    [nodes, edges, setNodes, setEdges, fitView],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Panel position="top-right">
        <button onClick={() => onLayout('TB')}>Vertical Layout</button>
        <button onClick={() => onLayout('LR')}>Horizontal Layout</button>
      </Panel>
    </ReactFlow>
  );
};

export default function DagreLayoutFlow() {
  return (
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  );
}
