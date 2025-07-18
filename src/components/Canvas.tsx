import React, { useCallback, useMemo, useEffect } from 'react'
import {
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Connection,
    Edge,
    Node,
    OnConnect,
    OnNodesChange,
    OnEdgesChange,
    MarkerType,
} from 'react-flow-renderer'
import ReactFlow from 'react-flow-renderer'
import CustomNode from './Node'

type MyNodeData = { label: string; config?: any }

interface CanvasProps {
    initialNodes: Node<MyNodeData>[]
    initialEdges: Edge[]
    onChange: (nodes: Node<MyNodeData>[], edges: Edge[]) => void
    onNodeClick?: (event: React.MouseEvent, node: Node<MyNodeData>) => void
}

let id = 0
const getId = () => `node_${id++}`

export default function Canvas({
    initialNodes,
    initialEdges,
    onChange,
    onNodeClick,
}: CanvasProps) {
    // Manage state
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(initialEdges)

    // Reset when initial props change (e.g. on agent switch)
    useEffect(() => {
        setNodes(initialNodes)
        setEdges(initialEdges)
    }, [initialNodes, initialEdges, setNodes, setEdges])

    // Bubble up changes
    useEffect(() => {
        onChange(nodes, edges)
    }, [nodes, edges, onChange])

    // Drag & drop handlers
    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
    }, [])

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        const label = e.dataTransfer.getData('application/reactflow')
        if (!label) return

        const bounds = (e.target as HTMLElement).getBoundingClientRect()
        const position = {
            x: e.clientX - bounds.left,
            y: e.clientY - bounds.top,
        }

        setNodes(nds => [
            ...nds,
            { id: getId(), type: 'custom', position, data: { label, config: {} } },
        ])
    }, [setNodes])

    // Connect nodes with arrows
    const onConnect: OnConnect = useCallback((params: Connection) => {
        setEdges(eds =>
            addEdge(
                {
                    ...params,
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#888' },
                    style: { stroke: '#888' },
                },
                eds
            )
        )
    }, [setEdges])

    const nodeTypes = useMemo(() => ({ custom: CustomNode }), [])

    return (
        <ReactFlowProvider>
            <div className="h-full w-full">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange as OnNodesChange}
                    onEdgesChange={onEdgesChange as OnEdgesChange}
                    onConnect={onConnect}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    nodeTypes={nodeTypes}
                    fitView
                    onNodeClick={onNodeClick}
                />
            </div>
        </ReactFlowProvider>
    )
}
