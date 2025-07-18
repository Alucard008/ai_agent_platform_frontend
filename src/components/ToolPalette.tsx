// src/components/ToolPalette.tsx
import React from "react"
import { useTools, Tool } from "../hooks/useTools"

export default function ToolPalette() {
    const { tools, isLoading } = useTools()
    if (isLoading) return <div>Loading tools…</div>

    return (
        <div className="p-2">
            <h2 className="font-semibold mb-2">Tools</h2>
            <ul>
                {tools.map((t: Tool) => (
                    <li
                        key={t.id}
                        className="mb-1 p-1 bg-gray-100 rounded cursor-grab"
                        draggable
                        onDragStart={e => {
                            e.dataTransfer.setData("application/reactflow", t.name)
                        }}
                    >
                        <strong>{t.name}</strong>
                        <div className="text-xs text-gray-600">{t.description}</div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
