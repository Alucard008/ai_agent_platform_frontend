import React, { useState, useEffect } from 'react'
import { Node, Edge } from 'react-flow-renderer'
import { postAPI } from 'services/api'
import { Agent } from 'types/agent'

type ToolStep = {
    name: string
    input_from: string
    config: Record<string, any>
}

interface AgentEditorPanelProps {
    nodes: Node<{ label: string; config?: any }>[]
    edges: Edge[]
    userId: string
    loadedAgent: Agent | null
    onSaved: (agent: Agent) => void
}

export default function AgentEditorPanel({
    nodes,
    edges,
    userId,
    loadedAgent,
    onSaved,
}: AgentEditorPanelProps) {
    const [agentName, setAgentName] = useState<string>(loadedAgent?.name || '')
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setAgentName(loadedAgent?.name || '')
    }, [loadedAgent])

    const handleSubmit = async () => {
        if (!agentName.trim()) {
            alert('Please enter an agent name')
            return
        }

        const workflow = {
            tools: nodes.map((node) => {
                const incoming = edges.find((e) => e.target === node.id)
                const input_from = incoming
                    ? nodes.find((n) => n.id === incoming.source)!.data.label
                    : 'query'
                return {
                    name: node.data.label,
                    input_from,
                    config: node.data.config || {},
                } as ToolStep
            }),
        }

        const isUpdate = Boolean(loadedAgent)
        const endpoint = isUpdate
            ? `/agents/${loadedAgent!.id}`
            : '/agents'
        const payload = isUpdate
            ? { agent_name: agentName, workflow }
            : { agent_name: agentName, user_id: userId, workflow }

        setLoading(true)
        try {
            await postAPI(endpoint, payload)

            const savedAgent: Agent = {
                id: loadedAgent?.id ?? Date.now(), // ideally from backend
                name: agentName,
                workflow,
            }

            alert(
                isUpdate
                    ? '✅ Agent updated successfully!'
                    : '✅ Agent created successfully!'
            )

            onSaved(savedAgent)
        } catch (err: any) {
            console.error(err)
            alert(`❌ ${isUpdate ? 'Update' : 'Create'} failed: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4 space-y-4 border-b">
            <h3 className="text-lg font-semibold">
                {loadedAgent ? '✏️ Edit Agent' : '➕ New Agent'}
            </h3>

            <div>
                <label className="block text-sm font-medium mb-1">Agent Name</label>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Enter agent name"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    disabled={loading}
                />
            </div>

            <button
                className={`btn w-full ${loadedAgent ? 'btn-accent' : 'btn-primary'}`}
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading
                    ? loadedAgent
                        ? 'Updating…'
                        : 'Creating…'
                    : loadedAgent
                        ? 'Update Agent'
                        : 'Create Agent'}
            </button>
        </div>
    )
}
