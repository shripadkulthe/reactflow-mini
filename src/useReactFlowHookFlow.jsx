import { useCallback, useEffect } from 'react';
import { ReactFlow, ReactFlowProvider, Background, Panel, addEdge, useNodesState, useEdgesState, useReactFlow, useStoreApi} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const themeCSS = `
  .rf-panel {
    font-size: 12px;
  }

  .rf-panel button {
    margin-right: 6px;
    color: #8e4391;
    margin-top: 8px;
    padding: 10px 15px;
    border-radius: 18px;
    border: 2px solid #c04cea;
    background: white;
    cursor: pointer;
  }

.react-flow__node.selected {
  border-color: #4ff0f0;
}
`;

const ariaLabelConfig = {
  'node.a11yDescription.default': 'Press Enter or Space to select this node',
  'node.a11yDescription.keyboardDisabled': 'Keyboard navigation is disabled',
  'edge.a11yDescription.default': 'Press Enter to select this edge',
};

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
    domAttributes: {
      'aria-roledescription': 'Input node',
      tabIndex: 0,
      'data-testid': 'node-1',
    },
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
    domAttributes: {
      'aria-roledescription': 'Process node',
      tabIndex: 0,
    },
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 400, y: 100 },
    domAttributes: {
      'aria-roledescription': 'Decision node',
      tabIndex: 0,
    },
  },
  {
    id: '4',
    data: { label: 'Node 4' },
    position: { x: 400, y: 200 },
    domAttributes: {
      'aria-roledescription': 'Output node',
      tabIndex: 0,
    },
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    domAttributes: {
      'aria-label': 'Edge from Node 1 to Node 2',
      tabIndex: 0,
    },
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    domAttributes: {
      'aria-label': 'Edge from Node 1 to Node 3',
      tabIndex: 0,
    },
  },
];

const ControlsPanel = () => {
  const store = useStoreApi();
  const { zoomIn, zoomOut, setCenter } = useReactFlow();

  const focusFirstNode = () => {
    const { nodeLookup } = store.getState();
    const nodes = Array.from(nodeLookup.values());
    if (!nodes.length) return;

    const node = nodes[0];
    const x = node.position.x + node.measured.width / 2;
    const y = node.position.y + node.measured.height / 2;

    setCenter(x, y, { zoom: 1.8, duration: 800 });
  };

  return (
    <Panel position="top-left" className="rf-panel">
      <div style={{ fontWeight: 600, marginBottom: 6 }}>useReactFlow Controls</div>
      <button onClick={focusFirstNode}>Focus Node</button>
      <button onClick={zoomIn}>Zoom In</button>
      <button onClick={zoomOut}>Zoom Out</button>
    </Panel>
  );
};

const Flow = () => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      nodesFocusable
      edgesFocusable
      disableKeyboardA11y={false}
      ariaLabelConfig={ariaLabelConfig}
    >
      <ControlsPanel />
      <Background />
    </ReactFlow>
  );
};

export default function UseReactFlowHookFlow() {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = themeCSS;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </div>
  );
}
