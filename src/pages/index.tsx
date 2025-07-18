import { useState, useCallback, useEffect } from "react"
import ToolPalette from "components/ToolPalette"
import AgentList from "components/AgentList"
import Canvas from "components/Canvas"
import AgentEditorPanel from "components/AgentEditorPanel"
import TestAgentPanel from "components/TestAgentPanel"
import NodePropertiesPanel from "components/NodePropertiesPanel"
import LogsPanel from "components/LogsPanel"
import type { Node, Edge } from "react-flow-renderer"
import type { Agent } from "types/agent"

export default function Home() {
    const userId = "1"
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [nodes, setNodes] = useState<Node<{ label: string; config?: any }>[]>([])
    const [edges, setEdges] = useState<Edge[]>([])
    const [loadedAgent, setLoadedAgent] = useState<Agent | null>(null)
    const [selNode, setSelNode] = useState<Node<{ label: string; config?: any }> | null>(null)
    const [logs, setLogs] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setSessionId(String(Date.now()))
        setIsLoading(false)
    }, [])

    const handleNew = () => {
        setLoadedAgent(null)
        setNodes([])
        setEdges([])
        setSelNode(null)
        setLogs([])
    }

    // ... rest of the functions remain the same ...






    const handleSelectAgent = (agent: Agent) => {
        setLoadedAgent(agent)
        setSelNode(null)
        setLogs([])

        const n = agent.workflow.tools.map((t, i) => ({
            id: `n${i}`,
            type: "custom" as const,
            position: { x: i * 200 + 50, y: 100 },
            data: { label: t.name, config: t.config ?? {} },
        }))

        const e: Edge[] = agent.workflow.tools
            .map((t, i) => {
                if (t.input_from === "query") return null
                const srcIdx = agent.workflow.tools.findIndex((x) => x.name === t.input_from)
                if (srcIdx < 0) return null
                return {
                    id: `e${srcIdx}-${i}`,
                    source: `n${srcIdx}`,
                    target: `n${i}`,
                    arrowHeadType: "arrowclosed",
                } as Edge
            })
            .filter((x): x is Edge => Boolean(x))

        setNodes(n)
        setEdges(e)
    }

    const handleCanvasChange = useCallback(
        (nn: Node<{ label: string; config?: any }>[], ee: Edge[]) => {
            setNodes(nn)
            setEdges(ee)
            setSelNode(null)
        },
        []
    )

    const handleNodeClick = useCallback(
        (_: React.MouseEvent, node: Node<{ label: string; config?: any }>) => {
            setSelNode(node)
        },
        []
    )

    const updateNodeConfig = useCallback(
        (cfg: any) => {
            if (!selNode) return
            setNodes((nds) =>
                nds.map((n) =>
                    n.id === selNode.id ? { ...n, data: { ...n.data, config: cfg } } : n
                )
            )
        },
        [selNode]
    )

    const appendLog = useCallback((msg: string) => {
        setLogs((ls) => [...ls, msg])
    }, [])


    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col bg-gray-50">
            <div className="flex flex-1 min-h-0">
                {/* Left sidebar */}
                <div className="w-64 bg-white border-r shadow-sm p-4 space-y-4 flex flex-col">
                    <div className="space-y-4 flex-1 overflow-auto">
                        <button
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all"
                            onClick={handleNew}
                        >
                            + New Agent
                        </button>
                        <div className="bg-gray-100 p-3 rounded-lg">
                            <h3 className="font-semibold text-gray-700 mb-2">Tools Palette</h3>
                            <ToolPalette />
                        </div>
                        <div className="bg-gray-100 p-3 rounded-lg flex-1">
                            <h3 className="font-semibold text-gray-700 mb-2">Agents</h3>
                            <AgentList
                                selectedAgentId={loadedAgent?.id ?? null}
                                onSelect={handleSelectAgent}
                            />
                        </div>
                    </div>
                </div>

                {/* Main canvas */}
                <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 min-h-0">
                    <Canvas
                        key={loadedAgent?.id ?? "new"}
                        initialNodes={nodes}
                        initialEdges={edges}
                        onChange={handleCanvasChange}
                        onNodeClick={handleNodeClick}
                    />
                </div>

                {/* Right sidebar */}
                <div className="w-80 bg-white border-l shadow-sm p-4 space-y-4 overflow-auto">
                    {selNode ? (
                        <div className="bg-white rounded-xl border p-4 shadow-sm">
                            <NodePropertiesPanel node={selNode} onChange={updateNodeConfig} />
                        </div>
                    ) : loadedAgent && sessionId ? (
                        <div className="bg-white rounded-xl border p-4 shadow-sm">
                            <TestAgentPanel
                                agentName={loadedAgent.agent_name}
                                userId={userId}
                                sessionId={sessionId}
                                onNewLog={appendLog}
                            />
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border p-4 shadow-sm">
                            <AgentEditorPanel
                                userId={userId}
                                nodes={nodes}
                                edges={edges}
                                loadedAgent={loadedAgent}
                                onSaved={(newAgent: Agent) => {
                                    setLoadedAgent(newAgent)
                                    appendLog(`[✅ Saved "${newAgent.agent_name}"]`)
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Logs panel */}
            <div className="bg-gray-800 text-gray-200 border-t h-40 flex flex-col">
                <div className="px-4 py-2 bg-gray-900 font-mono font-semibold">
                    Execution Logs
                </div>
                <div className="flex-1 overflow-auto">
                    <LogsPanel messages={logs} />
                </div>
            </div>
        </div>
    )
}