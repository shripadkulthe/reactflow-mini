import { useCallback } from 'react';
import { Background, ReactFlow, ReactFlowProvider, useNodesState, useEdgesState, addEdge, Controls, useStore} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const themeCSS = `
.react-flow {
  --xy-theme-selected: #f57dbd;
  --xy-node-border-default: 1px solid #eae5e5;
  --xy-node-border-radius-default: 8px;
}

.react-flow__node.selectable:hover {
  border-color: var(--xy-theme-hover);
}

.react-flow__node.selectable.selected {
  border-color: var(--xy-theme-selected);
}

.react-flow__edge.selectable:hover .react-flow__edge-path,
.react-flow__edge.selectable.selected .react-flow__edge-path {
  stroke: var(--xy-theme-edge-hover);
}

.xy-theme__button {
  height: 2.25rem;
  padding: 0 1rem;
  border-radius: 999px;
  border: 1px solid #ff0073;
  background: white;
  color: #ff0073;
  cursor: pointer;
}

.providerflow {
  display: flex;
  height: 100%;
}

.providerflow aside {
  width: 240px;
  border-left: 1px solid #eee;
  padding: 12px;
  font-size: 12px;
  background: #fff;
}

.providerflow .reactflow-wrapper {
  flex-grow: 1;
}

.providerflow .selectall {
  margin-top: 10px;
}
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = themeCSS;
  document.head.appendChild(style);
}

const initialNodes = [
  { id: 'provider-1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 } },
  { id: 'provider-2', data: { label: 'Node 2' }, position: { x: 100, y: 100 } },
  { id: 'provider-3', data: { label: 'Node 3' }, position: { x: 400, y: 100 } },
  { id: 'provider-4', data: { label: 'Node 4' }, position: { x: 400, y: 200 } },
];

const initialEdges = [
  { id: 'provider-e1-2', source: 'provider-1', target: 'provider-2', animated: true },
  { id: 'provider-e1-3', source: 'provider-1', target: 'provider-3' },
];

const transformSelector = (state) => state.transform;

function Sidebar({ nodes, setNodes }) {
  const transform = useStore(transformSelector);

  const selectAll = useCallback(() => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: true })));
  }, [setNodes]);

  return (
    <aside>
      <div style={{ marginBottom: 8 }}>
        This sidebar lives outside <code>{'<ReactFlow />'}</code> but still reads state.
      </div>

      <div style={{ fontWeight: 600 }}>Zoom & pan</div>
      <div style={{ marginBottom: 12 }}>
        [{transform[0].toFixed(2)}, {transform[1].toFixed(2)}, {transform[2].toFixed(2)}]
      </div>

      <div style={{ fontWeight: 600 }}>Nodes</div>
      {nodes.map((node) => (
        <div key={node.id}>
          {node.id} → x: {node.position.x.toFixed(1)}, y:{' '}
          {node.position.y.toFixed(1)}
        </div>
      ))}

      <div className="selectall">
        <button className="xy-theme__button" onClick={selectAll}>
          Select all nodes
        </button>
      </div>
    </aside>
  );
}

function FlowCanvas({ nodes, edges, onNodesChange, onEdgesChange, onConnect }) {
  return (
    <div className="reactflow-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

export default function ReactFlowProviderFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="providerflow" style={{ height: '100vh', width: '100%' }}>
      <ReactFlowProvider>
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        />
        <Sidebar nodes={nodes} setNodes={setNodes} />
      </ReactFlowProvider>
    </div>
  );
}
