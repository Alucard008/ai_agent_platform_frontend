import React, { useState } from "react"
import { postAPI } from "../services/api"

interface Props {
    agentName: string
    userId: string
    sessionId: string
    onNewLog: (msg: string) => void
}

export default function TestAgentPanel({
    agentName,
    userId,
    sessionId,
    onNewLog,
}: Props) {
    const [query, setQuery] = useState("")

    const handleRun = async () => {
        const payload = {
            query,
            session_id: sessionId,
            agent_name: agentName,
            user_id: userId,
        }
        onNewLog(`[> RUN] ${query}`)
        try {
            const resp = await postAPI("/run-task", payload) as { output: string }
            onNewLog(`[< RESULT] ${resp.output}`)
        } catch (e: any) {
            onNewLog(`[⚠️ ERROR] ${e.message}`)
        }
    }

    return (
        <div>
            <h2 className="font-semibold mb-2">Test Agent</h2>
            <textarea
                className="w-full mb-2 p-1 border rounded"
                rows={3}
                placeholder="Enter query…"
                value={query}
                onChange={e => setQuery(e.target.value)}
            />
            <button
                onClick={handleRun}
                className="w-full bg-blue-500 text-white py-1 rounded hover:bg-blue-600"
            >
                Run
            </button>
        </div>
    )
}
