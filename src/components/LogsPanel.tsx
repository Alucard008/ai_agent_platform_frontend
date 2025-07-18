import React from "react"

interface Props {
    messages: string[]
}

export default function LogsPanel({ messages }: Props) {
    return (
        <div className="p-2 text-xs font-mono">
            {messages.map((m, i) => (
                <div key={i} className="mb-1">
                    {m}
                </div>
            ))}
        </div>
    )
}
