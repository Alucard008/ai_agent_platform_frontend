import { useAPI } from "../services/api"
import type { Agent } from "../types/agent"

export default function AgentList({
    selectedAgentId,
    onSelect,
}: {
    selectedAgentId: number | null
    onSelect: (agent: Agent) => void
}) {

    const { data: agents = [], error, isLoading } = useAPI<Agent[]>("/agents")

    if (error) {
        return (
            <div className="p-4 text-red-500">
                Failed to load agents: {error.message}
            </div>
        )
    }
    if (isLoading) {
        return <div className="p-4">Loading agents…</div>
    }

    return (
        <div className="p-4 space-y-1">
            <h2 className="font-bold">📂 Agents</h2>
            {agents.map((a) => (
                <div
                    key={a.id}
                    onClick={() => onSelect(a)}
                    className={`p-2 rounded cursor-pointer hover:bg-gray-200 ${a.id === selectedAgentId ? "bg-gray-300" : "bg-gray-100"
                        }`}
                >
                    {a.agent_name}
                </div>
            ))}
        </div>
    )
}
