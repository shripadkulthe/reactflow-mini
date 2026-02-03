import React, { useCallback, useMemo } from 'react';
import ELK from 'elkjs/lib/elk.bundled.js';
import {ReactFlow, ReactFlowProvider, Panel, useNodesState, useEdgesState, useReactFlow } from '@xyflow/react'; 
import '@xyflow/react/dist/style.css';

const elk = new ELK();

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

const useElkLayout = () => {
  const { getNodes, getEdges, setNodes, fitView } = useReactFlow();

  const defaultOptions = useMemo(
    () => ({
      'elk.algorithm': 'layered',
      'elk.layered.spacing.nodeNodeBetweenLayers': 100,
      'elk.spacing.nodeNode': 80,
    }),
    []
  );

  const getLayoutedElements = useCallback(
    async (options = {}) => {
      const graph = {
        id: 'root',
        layoutOptions: { ...defaultOptions, ...options },
        children: getNodes().map((node) => ({
          ...node,
          width: node.measured?.width || 150,
          height: node.measured?.height || 50,
        })),
        edges: getEdges(),
      };

      const { children } = await elk.layout(graph);

      children.forEach((node) => {
        node.position = { x: node.x, y: node.y };
      });

      setNodes(children);
      requestAnimationFrame(() => fitView({ padding: 0.2 }));
    },
    [defaultOptions, getNodes, getEdges, setNodes, fitView]
  );

  return { getLayoutedElements };
};

const ElkLayoutFlow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const { getLayoutedElements } = useElkLayout();

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Panel position="top-right">
        <button onClick={() => getLayoutedElements({ 'elk.direction': 'DOWN' })}>
          Vertical Layout
        </button>
        <button onClick={() => getLayoutedElements({ 'elk.direction': 'RIGHT' })}>
          Horizontal Layout
        </button>
        <button
          onClick={() =>
            getLayoutedElements({ 'elk.algorithm': 'org.eclipse.elk.radial' })
          }
        >
          Radial Layout
        </button>
        <button
          onClick={() =>
            getLayoutedElements({ 'elk.algorithm': 'org.eclipse.elk.force' })
          }
        >
          Force Layout
        </button>
      </Panel>
    </ReactFlow>
  );
};

export default function ElkjsLayout() {
  return (
    <ReactFlowProvider>
      <ElkLayoutFlow />
    </ReactFlowProvider>
  );
}
