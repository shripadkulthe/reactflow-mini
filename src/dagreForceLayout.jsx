import React, { useMemo, useRef } from 'react';
import { ReactFlow, ReactFlowProvider, Panel, useNodesState, useEdgesState, useReactFlow, useNodesInitialized } from '@xyflow/react';  
import { forceSimulation, forceLink, forceManyBody, forceCollide, forceX, forceY } from 'd3-force';
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

const simulation = forceSimulation().stop();

const useForceLayout = () => {
  const { getNodes, getEdges, setNodes, fitView } = useReactFlow();
  const initialized = useNodesInitialized();
  const rafRef = useRef();
  const runningRef = useRef(false);
  const draggingRef = useRef(null);

  const dragEvents = useMemo(
    () => ({
      start: (_e, n) => (draggingRef.current = n),
      drag: (_e, n) => (draggingRef.current = n),
      stop: () => (draggingRef.current = null),
    }),
    [],
  );

  return useMemo(() => {
    if (!initialized) return [false, {}, dragEvents];

    let nodes = getNodes().map((n) => ({
      ...n,
      x: n.position.x,
      y: n.position.y,
    }));

    const edges = getEdges();

    const centerNodesInView = () => {
      const xs = nodes.map((n) => n.x);
      const ys = nodes.map((n) => n.y);
      const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
      const cy = (Math.min(...ys) + Math.max(...ys)) / 2;

      nodes.forEach((n) => {
        n.x -= cx;
        n.y -= cy;
      });
    };

    const tick = () => {
      getNodes().forEach((node, i) => {
        if (draggingRef.current?.id === node.id) {
          nodes[i].fx = draggingRef.current.position.x;
          nodes[i].fy = draggingRef.current.position.y;
        } else {
          nodes[i].fx = null;
          nodes[i].fy = null;
        }
      });

      simulation.tick();

      centerNodesInView();

      setNodes(
        nodes.map((n) => ({
          ...n,
          position: { x: n.x, y: n.y },
        })),
      );

      fitView({ duration: 0 });

      rafRef.current = requestAnimationFrame(tick);
    };

    const start = () => {
      nodes = getNodes().map((n) => ({
        ...n,
        x: n.position.x,
        y: n.position.y,
      }));

      simulation
        .nodes(nodes)
        .force(
          'link',
          forceLink(edges)
            .id((d) => d.id)
            .distance(100)
            .strength(0.05),
        )
        .force('charge', forceManyBody().strength(-1000))
        .force('collide', forceCollide(70))
        .force('x', forceX().x(0).strength(0.05))
        .force('y', forceY().y(0).strength(0.05))
        .alphaTarget(0.05)
        .restart();

      runningRef.current = true;
      rafRef.current = requestAnimationFrame(tick);
    };

    const stop = () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      simulation.stop();
    };

    return [
      true,
      {
        toggle: () => (runningRef.current ? stop() : start()),
        isRunning: () => runningRef.current,
      },
      dragEvents,
    ];
  }, [initialized, dragEvents, getNodes, getEdges, setNodes, fitView]);
};


const Flow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [initialized, { toggle, isRunning }, dragEvents] = useForceLayout();

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodeDragStart={dragEvents.start}
      onNodeDrag={dragEvents.drag}
      onNodeDragStop={dragEvents.stop}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
      <Panel position="top-left">
        {initialized && (
          <button onClick={toggle}>
            {isRunning() ? 'Stop' : 'Start'} force simulation
          </button>
        )}
      </Panel>
    </ReactFlow>
  );
};

export default function DagreForceLayout() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
