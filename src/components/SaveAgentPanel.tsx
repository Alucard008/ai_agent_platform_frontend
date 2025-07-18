// src/components/SaveAgentPanel.tsx
import React, { useState } from "react"
import { postAPI } from "../services/api"

interface Props {
    userId: string
    nodes: any[]
    edges: any[]
    selectedAgentId: number | null
    selectedAgentName: string
    onSaved: (id: number, name: string) => void
}

export default function SaveAgentPanel({
    userId,
    nodes,
    edges,
    selectedAgentId,
    selectedAgentName,
    onSaved,
}: Props) {
    const [name, setName] = useState(selectedAgentName)

    const buildWorkflow = () => ({
        tools: nodes.map(node => {
            // find which edge targets this node
            const incoming = edges.find(e => e.target === node.id)
            const inputLabel = incoming
                ? (nodes.find(n => n.id === incoming.source)?.data.label || "query")
                : "query"

            return {
                name: node.data.label,
                input_from: inputLabel,
                config: node.data.config ?? {},
            }
        }),
    })

    const handleSave = async () => {
        const payload = {
            agent_name: name,
            user_id: userId,
            workflow: buildWorkflow(),
        }

        let result
        if (selectedAgentId) {
            result = await fetch(`/agents/${selectedAgentId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            }).then(r => r.json())
        } else {
            result = await postAPI("/agents", payload)
        }
        onSaved(result.agent_id ?? selectedAgentId, name)
        alert("Saved!")
    }

    return (
        <div className="p-2">
            <h2 className="font-semibold mb-2">
                {selectedAgentId ? "Edit Agent" : "New Agent"}
            </h2>
            <input
                type="text"
                className="w-full mb-2 p-1 border rounded"
                placeholder="Agent name…"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <button
                onClick={handleSave}
                className="w-full bg-green-500 text-white py-1 rounded hover:bg-green-600"
            >
                Save Agent
            </button>
        </div>
    )
}
